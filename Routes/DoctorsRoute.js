import { Router } from "express";
import {
  GetAvailableTimes,
  GetDoctors,
  GetReviews,
  PostAvailableTime,
  PostSignup,
} from "../Controllers/DoctorsController.js";
import {
  GetAvailableTimesValidator,
  GetDoctorsValidator,
  GetReviewsValidator,
  PostAvailableTimeValidator,
  PostSignupValidator,
  PutProfileValidator,
} from "../Validators/DoctorsValidators.js";
import { PutProfile } from "../Controllers/DoctorsController.js";

const DoctorsRouter = Router();

DoctorsRouter.post("/doctors/signup", PostSignupValidator, PostSignup);
DoctorsRouter.put("/doctor/profile", PutProfileValidator, PutProfile);
DoctorsRouter.get("/doctors", GetDoctorsValidator, GetDoctors);
DoctorsRouter.get("/doctor/reviews", GetReviewsValidator, GetReviews);
DoctorsRouter.post(
  "/doctor/availabletimes",
  PostAvailableTimeValidator,
  PostAvailableTime
);
DoctorsRouter.get(
  "/doctor/availabletimes",
  GetAvailableTimesValidator,
  GetAvailableTimes
);
export default DoctorsRouter;
