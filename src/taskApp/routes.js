import { Router } from "express";
import { asyncHandler } from "../config/utils.js";
import { checkObjectId } from "../userApp/middleware.js";
import { verifyJWT } from "../userApp/utils.js";
import * as taskViews from "./views.js";
const router = Router();

router.get("/", verifyJWT, asyncHandler(taskViews.getTasks));
router.post("/", verifyJWT, asyncHandler(taskViews.addTask));
router.put(
  "/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(taskViews.completeTask)
);
router.delete(
  "/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(taskViews.deleteTask)
);

export { router };
