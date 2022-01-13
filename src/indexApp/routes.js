//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";

import { upload } from "../base.js";

import { router as UserRouter } from "../userApp/routes.js";
import { router as BlogRouter } from "../blogApp/routes.js";

import { refreshTokenView } from "../userApp/views.js";

const router = Router();

//write your routes here
/**
 * @openapi
 * tags:
 *  name: Index
 *  description: Routes for the user App
 */

/**
 * @openapi
 * /:
 *  get:
 *      summary: Test if the api is working by accessing home
 *      tags:
 *          - Index
 */
router.get("/", views.IndexView);
router.use("/account", UserRouter);
router.use("/blog", BlogRouter);

/**
 * @openapi
 * /:
 *  post:
 *      summary: Test if the api is working by accessing home
 *      tags:
 *          - Index
 */
router.post("/app/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "File uploaded successfully" });
});

/**
 * @openapi
 * /:
 *  get:
 *      summary: Refresh a user token
 *      tags:
 *          - Index
 */
router.get("/refresh", refreshTokenView);

//Keep this line at the bottom

export { router };
