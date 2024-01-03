import { Router } from "express";
import {
  PostAuth,
  PostLogin,
  PostLogout,
} from "../Controllers/AuthController.js";
import {
  PostAuthValidator,
  PostLoginValidator,
} from "../Validators/AuthValidators.js";
const AuthRouter = Router();

AuthRouter.post("/user/auth", PostAuthValidator, PostAuth);
AuthRouter.post("/user/login", PostLoginValidator, PostLogin);
AuthRouter.post("/user/logout", PostLogout);
export default AuthRouter;