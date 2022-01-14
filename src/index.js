import dotenv from "dotenv";
dotenv.config();
import express, { static as staticExpress } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path, { join } from "path";
import cors from "cors";
const __dirname = path.resolve();
import { optionsToCustomizeSwagger, swaggerOptions } from "./base.js";
import { connectDB } from "./base.js";
import { router as IndexRouter } from "./indexApp/routes.js";
import { IndexView } from "./indexApp/views.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(staticExpress(join(__dirname, "public")));
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, optionsToCustomizeSwagger, { explorer: true })
);

connectDB();
const apiRoute = process.env.API_BASE || "/api/v1/";
app.use(apiRoute, IndexRouter);
app.get("/", IndexView);

const PORT = process.env.PORT || 3500;
mongoose.connection.once("open", () => {
  console.log("Mongoose connected");
  app.listen(PORT, () => {
    console.log("Server started: ", PORT, apiRoute);
  });
});

export { app };
