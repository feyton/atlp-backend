import { Router } from "express";
import { asyncHandler } from "../config/utils.js";
import { checkObjectId } from "../userApp/middleware.js";
import { verifyJWT } from "../userApp/utils.js";
import { validate } from "../userApp/validator.js";
import { taskCreateRules } from "./validator.js";
import * as taskViews from "./views.js";

const router = Router();

router.get("/", verifyJWT, asyncHandler(taskViews.getTasks));
router.post("/", verifyJWT, taskCreateRules(), validate, asyncHandler(taskViews.addTask));
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
