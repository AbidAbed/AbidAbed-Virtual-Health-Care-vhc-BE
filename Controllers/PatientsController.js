import Patients from "../Models/Patients.js";
import bcrypt from "bcrypt";
import Users from "../Models/Users.js";
import jwt from "jsonwebtoken";
import Reviews from "../Models/Reviews.js";
import Doctors from "../Models/Doctors.js";
const secretKey = "VERYSECRETKEY";
const saltRounds = 10;

function extractUserFields(user) {
  const { chat, _id, name, email, reviews, appointments } = user;

  // Convert _id from Buffer to a string (assuming it's a UUID)
  const idString = _id.toString("hex");

  return {
    _id: idString,
    name,
    email,
    reviews,
    appointments,
    chat,
  };
}

function extractReviewFields(review) {
  const { rate, _id, comment, doctor_id, patient_id, time } = review;

  // Convert _id from Buffer to a string (assuming it's a UUID)
  const idString = _id.toString("hex");
  const doctor_idString = doctor_id.toString("hex");
  const patient_idString = patient_id.toString("hex");
  return {
    _id: idString,
    doctor_id: doctor_idString,
    patient_id: patient_idString,
    comment,
    rate,
    time,
  };
}

async function PostSignup(request, response) {
  try {
    const hashedBassword = await bcrypt.hash(request.body.password, saltRounds);

    const foundUser = await Users.findOne({ email: request.body.email });

    if (foundUser) {
      response.status(400).send();
      return;
    }

    const user = await Users.create({
      password: hashedBassword,
      role: "patient",
      email: request.body.email,
    });

    const patient = await Patients.create({
      _id: user._id,
      name: request.body.name,
      email: request.body.email,
      reviews: [],
      chat: {},
      appointments: [],
    });

    if (patient && user) response.status(200).send();
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
async function PutProfile(request, response) {
  try {
    const { token } = request.cookies;

    const decoded = await jwt.verify(token, secretKey);

    if (decoded) {
      const user = await Users.findOne({ _id: decoded.id });

      if (!user) {
        response.status(400).send();
        return;
      }
      if (user.role !== "patient") {
        response.status(401).send();
        return;
      }

      if (Object.keys(request.body).length === 1) {
        response.status(203).send();
        return;
      }
      const { _id, ...rest } = request.body;

      console.log(rest);
      const { patientData, userData } = await Object.entries(rest).reduce(
        async (prevPromise, curr) => {
          const prev = await prevPromise;

          if (curr[0] === "email") {
            prev.userData.email = curr[1];
          } else if (curr[0] === "password") {
            const hashedPassword = await bcrypt.hash(curr[1], saltRounds);
            prev.userData.password = hashedPassword;
          } else {
            prev.patientData[curr[0]] = curr[1];
          }

          return prev;
        },
        Promise.resolve({ patientData: {}, userData: {} })
      );

      console.log(patientData, userData);
      const rsltUserQuery = await Users.updateOne(
        { _id: user._id },
        { ...userData }
      );
      const rsltPatientQuery = await Patients.updateOne(
        { _id: user._id },
        { ...patientData }
      );

      console.log(rsltUserQuery, rsltPatientQuery);

      if (
        rsltUserQuery.modifiedCount === 1 ||
        rsltPatientQuery.modifiedCount === 1
      ) {
        const patient = await Patients.findOne({ _id: user._id });
        response.status(200).send({ ...extractUserFields(patient) });
      } else response.status(400).send();
    }
  } catch (err) {
    response.status(401).send();
    console.log(err);
  }
}

async function PostReview(request, response) {
  try {
    const { token } = request.cookies;

    const decoded = await jwt.verify(token, secretKey);

    if (decoded) {
      const user = await Users.findOne({ _id: decoded.id });

      if (!user) {
        response.status(400).send();
        return;
      }
      if (user.role !== "patient") {
        response.status(401).send();
        return;
      }
      const patient = await Patients.findOne({ _id: decoded.id });
      const doctor = await Doctors.findOne({ _id: request.body.doctor_id });
      const review = await Reviews.create({
        rate: request.body.rate,
        comment: request.body.comment,
        doctor_id: request.body.doctor_id,
        patient_id: decoded.id,
        time: request.body.time,
      });

      patient.reviews = [...patient.reviews, review._id];

      doctor.reviews = [...doctor.reviews, review._id];

      doctor.ratingSum += request.body.rate;

      console.log([...doctor.reviews].length,doctor.ratingSum,doctor.rate);
      doctor.rate = doctor.ratingSum / [...doctor.reviews].length;

      const updatedDoctor = await Doctors.updateOne(
        { _id: request.body.doctor_id },
        { ...doctor.toObject() }
      );

      const updatedPatient = await Patients.updateOne(
        { _id: decoded.id },
        { ...patient.toObject() }
      );

      if (
        updatedDoctor.modifiedCount === 1 &&
        updatedPatient.modifiedCount === 1 &&
        review
      )
        response.status(200).send({
          ...extractReviewFields(review),
        });
    } else response.status(401).send();
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}

export default PostReview;

export { PostSignup, PutProfile, PostReview };
