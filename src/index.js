import dotenv from "dotenv";
dotenv.config();
import express, { static as staticExpress } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path, { join } from "path";
const __dirname = path.resolve();
import { optionsToCustomizeSwagger, swaggerOptions } from "./base.js";
import { connectDB } from "./base.js";
import { router as IndexRouter } from "./indexApp/routes.js";

const app = express();
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

app.use("/", IndexRouter);

const PORT = process.env.PORT || 3500;
mongoose.connection.once("open", () => {
  console.log("Mongoose connected");
  app.listen(PORT, () => {
    console.log("Server started: ", PORT);
  });
});

export { app };
