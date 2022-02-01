//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { router as BlogRouter } from "../blogApp/routes.js";
import { handleUpload, upload } from "../config/base.js";
import { asyncHandler } from "../config/utils.js";
import { router as ContactRoute } from "../contactApp/routes.js";
import { router as TaskRouter } from "../taskApp/routes.js";
import { router as UserRouter } from "../userApp/routes.js";
import { adminRequired, verifyJWT } from "../userApp/utils.js";
import { refreshTokenView } from "../userApp/views.js";
import { getLogs } from "./views.js";
const router = Router();

router.use("/accounts", UserRouter);
router.use("/blogs", BlogRouter);
router.use("/tasks", TaskRouter);
router.use("/contacts", ContactRoute);
router.post(
  "/post-uploads",
  verifyJWT,
  upload.single("post-image"),
  asyncHandler(handleUpload)
);
router.get("/refresh", refreshTokenView);
router.get("/logs/:filename", verifyJWT, adminRequired, getLogs);

//Keep this line at the bottom

export { router };
