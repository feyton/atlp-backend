import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { static as staticExpress } from "express";
import mongoose from "mongoose";
import path, { join } from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {
  connectDB,
  optionsToCustomizeSwagger,
  swaggerOptions,
} from "./base.js";
import { router as IndexRouter } from "./indexApp/routes.js";
import { IndexView } from "./indexApp/views.js";
import { errLogger, logger } from "./config/utils.js";

dotenv.config();
connectDB();
const __dirname = path.resolve();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const apiRoute = process.env.API_BASE || "/api/v1/";

const app = express();
app.use(logger);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(staticExpress(join(__dirname, "public")));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, optionsToCustomizeSwagger, { explorer: true })
);

app.use(apiRoute, IndexRouter);
app.get("/", IndexView);


app.all("*", (req, res) => {
  return res.status(404).json({
    status: "fail",
    code: 404,
    message: "Not found",
  });
});

app.use(errLogger);
const PORT = process.env.PORT || 3500;
mongoose.connection.once("open", () => {
  console.log("Mongoose connected");
  app.listen(PORT, () => {
    console.log("Server started: ", PORT);
  });
});

export { app, apiRoute };
