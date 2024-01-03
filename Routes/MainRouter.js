import { Router } from "express";
import AuthRouter from "./AuthRoute.js";
import PatientsRouter from "./PatientsRoute.js";
import DoctorsRouter from "./DoctorsRoute.js";

const MainRouter = Router();

MainRouter.use(AuthRouter);
MainRouter.use(DoctorsRouter)
MainRouter.use(PatientsRouter)

MainRouter.use((err, req, res, next) => {
  // Handle celebrate validation errors

  console.log(err)
  if (err.joi) {
    return res.status(400).json({
      error: "Validation error",
      details: err.joi.details.map((detail) => detail.message),
    });
  }

  // Handle other errors
  return res.status(400).json({
    details: err.message,
  });
});

export default MainRouter;
