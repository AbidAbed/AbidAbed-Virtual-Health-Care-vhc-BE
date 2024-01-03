import { Router } from "express";
import {
  PostReview,
  PostSignup,
  PutProfile,
} from "../Controllers/PatientsController.js";
import {
  PostReviewValidator,
  PostSignupValidator,
  PutProfileValidator,
} from "../Validators/PatientsValidators.js";

const PatientsRouter = Router();
PatientsRouter.post("/patients/signup", PostSignupValidator, PostSignup);
PatientsRouter.put("/patient/profile", PutProfileValidator, PutProfile);
PatientsRouter.post("/doctor/reviews", PostReviewValidator, PostReview);
export default PatientsRouter;
