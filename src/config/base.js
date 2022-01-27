// const DatauriParser = require("datauri/parser");
import { config, uploader } from "cloudinary";
import { parser } from "../blogApp/md.cjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
dotenv.config();
const serverUrl = process.env.SERVER_URL || "http://127.0.0.1:3500";
const serverName = process.env.SERVER_NAME || "LOCAL HOST";

export const connectDB = async () => {
  try {
    if (process.env.NODE_ENV == "test") {
      console.log("Test database loaded");
      mongoose.connect(process.env.TESTING_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to the testing bed");
    } else {
      mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Production link provided");
    }
  } catch (err) {
    console.error(err);
  }
};

const storage = multer.memoryStorage();

export const optionsToCustomizeSwagger = {
  customCssUrl: "/swagger.css",
  customSiteTitle: "ATLP DOCS",
  customfavIcon:
    "https://feyton.github.io/atpl_capstone_fabrice/assets/favicon.png",
};

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ATLP Project Docs",
      version: "1.0.0",
      description: "The Documentation for ATLP Capstone Project",
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
      contact: {
        name: "Fabrice Hafashimana",
        url: "https://github.com/feyton/atlp-backend#readme",
      },
    },
    servers: [
      {
        url: serverUrl,
        description: serverName,
      },
    ],
  },
  apis: ["src/**/*.js"],
};

export const upload = multer({
  storage,
});



const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  }),
    next();
};

export { cloudinaryConfig, uploader };

export const cloudinaryMiddleware = async (req, res, next) => {
  if (req.file) {
    const file =  parser.format(path.extname(req.file.originalname).toString(), req.file.buffer).content;
    const result = await uploader.upload(file);
    if (!result) {
      console.log("Error happened");
    }
    const imageUrl = result.url;
    req.file.path = imageUrl;
    console.log(imageUrl, result);
    next();
  } else {
    next();
  }
};
