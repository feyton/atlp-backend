import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
const serverUrl = process.env.SERVER_URL || "http://127.0.0.1:3500";
const serverName = process.env.SERVER_NAME || "LOCAL HOST";

export const connectDB = async () => {
  try {
    if (process.env.NODE_ENV == "test") {
      console.log("Testing on test database");
      mongoose.connect(process.env.TESTING_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media");
  },
  filename: (req, file, cb) => {
    console.log(req.body);
    cb(null, req.body.name);
  },
});

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
  apis: [
    "src/blogApp/routes.js",
    "src/userApp/routes.js",
    "src/indexApp/routes.js",
  ],
};

export const upload = multer({ storage: storage });
