import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import MainRouter from "./Routes/MainRouter.js";
import cors from "cors";

const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));

mongoose
  .connect("mongodb+srv://anasR:HAEhjKIcySR0OEV4@vhc.cvud0lm.mongodb.net/VHC")
  .then(() => {
    app.listen(3005, () => {
      console.log("Server is running, DB is working correctly");
    });
  })
  .catch((err) => {
    console.log("Server is not running, DB error", err);
  });

app.use(MainRouter);
