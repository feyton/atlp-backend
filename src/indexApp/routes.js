//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { router as BlogRouter } from "../blogApp/routes.js";
import { upload } from "../config/base.js";
import { asyncHandler } from "../config/utils.js";
import { router as ContactRoute } from "../contactApp/routes.js";
import { router as TaskRouter } from "../taskApp/routes.js";
import { router as UserRouter } from "../userApp/routes.js";
import { refreshTokenView } from "../userApp/views.js";
import { getLogs } from "./views.js";

const router = Router();

//write your routes here

router.use("/accounts", UserRouter);
router.use("/blogs", BlogRouter);
router.use("/tasks", TaskRouter);
router.use("/contacts", ContactRoute);
router.get(
  "/error",
  asyncHandler(async (req, res, next) => {
    //the error should be logged
    throw Error("Testing errors that log");
  })
);

router.post("/uploads", upload.single("image"), (req, res) => {
  res
    .status(200)
    .json({ message: "File uploaded successfully", path: req.file.path });
});
router.post("/post-upload", upload.single(), (req, res) => {
  res
    .status(200)
    .json({ message: "File uploaded successfully", path: req.file.path });
});

export const uploadPostImage = upload.single("image");
/**
 * @openapi
 * /api/v1/refresh:
 *  get:
 *      summary: Refresh a user token
 *      description: Use this route to refresh a token for a logged in user.
 *      tags:
 *          - Index
 *      responses:
 *         200:
 *             description: A JSON object is returned with a new access Token
 *         403:
 *             description: Invalid/ Expired token is received
 *         400:
 *             description: Missing a JWT cookie in request header.
 *         500:
 *             description: Server error
 */
router.get("/refresh", refreshTokenView);

router.get("/logs/:filename", getLogs);

//Keep this line at the bottom

export { router };
