import { Router } from "express";
import { cloudinaryMiddleware, upload } from "../config/base.js";
import { asyncHandler } from "../config/utils.js";
import { checkObjectId, validateLogin } from "./middleware.js";
import { verifyJWT } from "./utils.js";
import {
  newPasswordRules,
  pswResetRules,
  resetPasswordLinkRules,
  userSignupValidationRules,
  userUpdateValidationRules,
  userValidationRules,
  validate,
} from "./validator.js";
import * as views from "./views.js";

const router = Router();

router.post(
  "/signup",
  upload.single("image"),
  userSignupValidationRules(),
  validate,
  cloudinaryMiddleware,
  asyncHandler(views.createUserView)
);

router.post(
  "/login",
  userValidationRules(),
  validate,
  validateLogin,
  asyncHandler(views.loginView)
);

router.get(
  "/profile/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(views.getUserView)
);

router.put(
  "/profile/:id",
  verifyJWT,
  checkObjectId,
  upload.single("image"),
  userUpdateValidationRules(),
  validate,
  cloudinaryMiddleware,
  asyncHandler(views.updateUserView)
);

router.delete(
  "/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(views.deleteUserView)
);

router.post("/logout", asyncHandler(views.logoutView));
// Password management

router.post(
  "/password-reset",
  pswResetRules(),
  validate,
  asyncHandler(views.passwordReset)
);
router.post(
  "/password-reset/:id/:token",
  newPasswordRules(),
  validate,
  asyncHandler(views.newPassword)
);
router.get(
  "/password-reset/:id/:token",
  resetPasswordLinkRules(),
  validate,
  asyncHandler(views.resetLinkValidator)
);

//write your routes here

//Keep this line at the bottom

export { router };
