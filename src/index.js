import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { static as staticExpress } from "express";
import rateLimit from "express-rate-limit";
import path, { join } from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {
  cloudinaryConfig,
  connectDB,
  optionsToCustomizeSwagger,
  swaggerOptions,
} from "./config/base.js";
import { errLogger, logger } from "./config/utils.js";
import { router as IndexRouter } from "./indexApp/routes.js";
import { IndexView } from "./indexApp/views.js";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

dotenv.config();

const __dirname = path.resolve();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const apiRoute = process.env.API_BASE || "/api/v1/";

const app = express();
app.set('trust proxy', 1); 
app.use(logger);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("*", cloudinaryConfig);
app.use(staticExpress(join(__dirname, "public")));
app.use("/media", staticExpress(join(__dirname, "media")));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, optionsToCustomizeSwagger, { explorer: true })
);
app.use(limiter);

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
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server started: ", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export { app, apiRoute };
