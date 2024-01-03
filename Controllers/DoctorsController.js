import Doctors from "../Models/Doctors.js";
import Users from "../Models/Users.js";
import bcrypt from "bcrypt";
const saltRounds = 10;
import Reviews from "../Models/Reviews.js";
import jwt from "jsonwebtoken";
const secretKey = "VERYSECRETKEY";

function extractUserFields(user) {
  const {
    chat,
    _id,
    name,
    email,
    proficiency,
    bio,
    reviews,
    rate,
    appointments,
    availableTimes,
    ratingSum,
  } = user;

  // Convert _id from Buffer to a string (assuming it's a UUID)
  const idString = _id.toString("hex");

  return {
    _id: idString,
    name,
    email,
    proficiency,
    bio,
    reviews,
    rate,
    appointments,
    availableTimes,
    chat,
    ratingSum,
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

    console.log(foundUser);
    if (foundUser) {
      response.status(400).send();
      return;
    }

    const user = await Users.create({
      password: hashedBassword,
      role: "doctor",
      email: request.body.email,
    });

    const doctor = await Doctors.create({
      _id: user._id,
      name: request.body.name,
      email: request.body.email,
      proficiency: request.body.proficiency,
      bio: request.body.bio,
      reviews: [],
      chat: {},
      appointments: [],
      availableTimes: [],
      rate: 0,
    });

    if (doctor && user) response.status(200).send();
    else response.status(400).send();
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
      if (user.role !== "doctor") {
        response.status(401).send();
        return;
      }

      if (Object.keys(request.body).length === 1) {
        response.status(203).send();
        return;
      }
      const { _id, ...rest } = request.body;

      const { doctorData, userData } = await Object.entries(rest).reduce(
        async (prevPromise, curr) => {
          const prev = await prevPromise;

          if (curr[0] === "email") {
            prev.userData.email = curr[1];
          } else if (curr[0] === "password") {
            prev.userData.password = await bcrypt.hash(curr[1], saltRounds);
          } else {
            prev.doctorData[curr[0]] = curr[1];
          }

          return prev;
        },
        Promise.resolve({ doctorData: {}, userData: {} })
      );

      const rsltUserQuery = await Users.updateOne(
        { _id: user._id },
        { ...userData }
      );
      const rsltDoctorQuery = await Doctors.updateOne(
        { _id: user._id },
        { ...doctorData }
      );

      if (
        rsltUserQuery.modifiedCount === 1 ||
        rsltDoctorQuery.modifiedCount === 1
      ) {
        const doctor = await Doctors.findOne({ _id: user.id });
        response.status(200).send({ ...extractUserFields(doctor) });
      } else response.status(400).send();
    }
  } catch (err) {
    response.status(401).send();
    console.log(err);
  }
}
async function GetDoctors(request, response) {
  try {
    console.log(request.query);
    const doctors = await Doctors.find()
      .select("_id name email proficiency bio rate availableTimes")
      .skip((request.query.page - 1) * 10)
      .limit(10);

    const doctorsArr = doctors.map((doc) => {
      return extractUserFields(doc);
    });

    response.status(200).send([...doctorsArr]);
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
async function GetReviews(request, response) {
  try {
    const doctor = await Doctors.findOne({ _id: request.query.id });
    if(!doctor)  response.status(404).send();
    if (doctor.reviews === null || doctor.reviews.length === 0)
      response.status(200).send([]);
    const reviewsIds = doctor.reviews.slice(
      (request.query.page - 1) * 10,
      (request.query.page - 1) * 10 + 10
    );
    if (reviewsIds.length === 0) response.status(200).send([]);
    else {
      const reviews = await Reviews.find({ _id: reviewsIds });

      const reviewsArr = reviews.map((review) => {
        return extractReviewFields(review);
      });
      response.status(200).send([...reviewsArr]);
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}

async function PostAvailableTime(request, response) {
  try {
    const { token } = request.cookies;

    const decoded = await jwt.verify(token, secretKey);

    if (decoded) {
      const user = await Users.findOne({ _id: decoded.id });

      if (!user) {
        response.status(400).send();
        return;
      }
      if (user.role !== "doctor") {
        response.status(401).send();
        return;
      }
      const doctor = await Doctors.findOne({ _id: decoded.id });

      const resultUpdateDoctor = await Doctors.updateOne(
        { _id: doctor._id },
        {
          availableTimes: [
            ...doctor._doc.availableTimes,
            {
              startTime: request.body.startTime,
              endTime: request.body.endTime,
            },
          ],
        }
      );

      if (resultUpdateDoctor) response.status(200).send();
      else response.status(400).send();
    }
  } catch (err) {
    response.status(401).send();
    console.log(err);
  }
}

async function GetAvailableTimes(request, response) {
  try {
    const user = await Users.findOne({ _id: request.query.id });
    if (user._doc.role !== "doctor") response.status(400).send();
    else {
      const doctor = await Doctors.findOne({ _id: user._doc._id });
      console.log(doctor._doc);
      if (doctor)
        response
          .status(200)
          .send(
            doctor._doc.availableTimes.slice(
              (request.query.page - 1) * 10,
              (request.query.page - 1) * 10 + 9
            )
          );
      else response.status(400).send();
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
}
export {
  PostSignup,
  PutProfile,
  GetDoctors,
  GetReviews,
  PostAvailableTime,
  GetAvailableTimes,
};
