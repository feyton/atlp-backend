import { Router } from "express";
import { asyncHandler } from "../config/utils.js";
import { checkObjectId } from "../userApp/middleware.js";
import { adminRequired, verifyJWT } from "../userApp/utils.js";
import { validate } from "../userApp/validator.js";
import {
  contactCreateRules,
  replyMessageValidationRules,
} from "./validator.js";
import * as views from "./views.js";

const router = Router();
router.get("/status/:ticket", views.checkStatus);

router.post(
  "/",
  contactCreateRules(),
  validate,
  asyncHandler(views.saveContact)
);

router.get("/", verifyJWT, adminRequired, views.getContacts);
router.put(
  "/:id",
  checkObjectId,
  verifyJWT,
  adminRequired,
  replyMessageValidationRules(),
  validate,
  views.replyMessage
);
router.delete(
  "/:id",
  checkObjectId,
  verifyJWT,
  adminRequired,
  views.deleteMessage
);

export { router };
