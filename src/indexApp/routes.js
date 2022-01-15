//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { upload } from "../base.js";
import { router as BlogRouter } from "../blogApp/routes.js";
import { router as UserRouter } from "../userApp/routes.js";
import { refreshTokenView } from "../userApp/views.js";

const router = Router();

//write your routes here
/**
 * @openapi
 * tags:
 *  name: Index
 *  description: Routes for the user App
 */

router.use("/accounts", UserRouter);
router.use("/blogs", BlogRouter);

router.post("/uploads", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "File uploaded successfully" });
});

/**
 * @openapi
 * /api/v1/refresh:
 *  get:
 *      summary: Refresh a user token
 *      tags:
 *          - Index
 */
router.get("/refresh", refreshTokenView);

//Keep this line at the bottom

export { router };
