import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import { upload } from "./base.js";

const PORT = process.env.PORT || 3500;

const app = express();
// app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

import { router as IndexRouter } from "./indexApp/routes.js";
import { router as UserRouter } from "./userApp/routes.js";
import { router as BlogRouter } from "./blogApp/routes.js";
import { connectDB } from "./base.js";
import { refreshTokenView } from "./userApp/views.js";
connectDB();
app.post("/app/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "File uploaded successfully" });
});
app.get("/refresh", refreshTokenView);
app.use("/", IndexRouter);
app.use("/account", UserRouter);
app.use("/blog", BlogRouter);

mongoose.connection.once("open", () => {
  console.log("Mongoose connected");
  app.listen(PORT, () => {
    console.log("Server started: ", PORT);
  });
});
