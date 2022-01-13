import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err);
  }
};

import multer from "multer";
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
        url: "https://feyton.co.rw",
      },
    },
    servers: [
      {
        url: "http://127.0.0.1:3500",
        description: "Development server",
      },
      {
        url: "https://atlp-fabrice.herokuapp.com/",
        description: "The production server",
      },
    ],
  },
  apis: [
    "src/blogApp/routes.js",
    "src/userApp/routes.js",
    "src/indexApp/routes.js",
  ],
};

// export const swaggerOptions = {
//   swaggerDefinition,
// };

export const upload = multer({ storage: storage });
