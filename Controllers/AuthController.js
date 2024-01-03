import Users from "../Models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Patients from "../Models/Patients.js";
import Doctors from "../Models/Doctors.js";

const saltRounds = 10;
const secretKey = "VERYSECRETKEY";

async function PostLogin(request, response) {
  try {
    const { email, password } = request.body;
    const user = await Users.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = await jwt.sign(
          { id: user.id, role: user.role },
          secretKey
        );

        response.cookie("token", token, {
          maxAge: 1000 * 60 * 60,
        });

        response.status(200).send();
      } else {
        response.status(401).send();
      }
    } else response.status(404).send();
  } catch (err) {
    response.status(500).send();
  }
}
// Utility function to extract relevant fields from a Mongoose document
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
    chat,
  };
}

async function PostAuth(request, response) {
  try {
    const { token } = request.cookies;

    const decoded = await jwt.verify(token, secretKey);

    if (decoded) {
      const user = await Users.findOne({ _id: decoded.id });

      if (!user) {
        response.status(400).send();
        return;
      }

      let responseData;

      if (user.role === "patient") {
        const patient = await Patients.findOne({ _id: user.id });
        if (patient) {
          responseData = { role: "patient", user: extractUserFields(patient) };
        } else {
          response.status(401).send();
          return;
        }
      } else {
        const doctor = await Doctors.findOne({ _id: user.id });
        if (doctor) {
          responseData = { role: "doctor", user: extractUserFields(doctor) };
        } else {
          response.status(401).send();
          return;
        }
      }

      response.status(200).send({ ...responseData });
    } else {
      response.status(401).send();
    }
  } catch (err) {
    console.log(err)
    response.status(500).send();
  }
}

async function PostLogout(request, response) {
  try {
    response.cookie("token", "", {
      maxAge: 0 * 0 * 0,
    });
    response.status(200).send();
  } catch (err) {
    response.status(401);
  }
}

export { PostAuth, PostLogin, PostLogout };
