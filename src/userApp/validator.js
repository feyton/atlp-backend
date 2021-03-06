import { body, param, validationResult } from "express-validator";
import { responseHandler } from "../config/utils.js";
import { userModel } from "./models.js";
const User = userModel;

export const userSignupValidationRules = () => {
  return [
    body("firstName")
      .isLength({
        min: 3,
        max: 30,
      })
      .withMessage("A valid first name must be 3< chars> 30"),
    body("lastName")
      .isLength({
        min: 3,
        max: 30,
      })
      .withMessage("A valid last name must be 3< chars> 30"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("You will need a valid email to signup"),
    body("password")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Must be minimum 6 and have at least one number, uppercase letter, lowercase letter, and a character"
      ),
  ];
};
export const userUpdateValidationRules = () => {
  return [
    body("firstName")
      .optional()
      .isLength({
        min: 3,
        max: 30,
      })
      .withMessage("A valid first name must be 3< chars> 30"),
    body("lastName")
      .optional()
      .isLength({
        min: 3,
        max: 30,
      })
      .withMessage("A valid last name must be 3< chars> 30"),
    body("email")
      .optional()
      .custom((value) => {
        return Promise.reject("You can not edit email after account creation");
      }),
    body("password")
      .optional()
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Must be minimum 6 and have at least one number, uppercase letter, lowercase letter, and a character"
      ),
  ];
};
const userValidationRules = () => {
  return [
    body("email", "A valid email is required").notEmpty().isEmail(),
    body("password", "Password is required").notEmpty(),
  ];
};

export const pswResetRules = () => {
  return [
    body("email", "A valid email is required")
      .notEmpty()
      .isEmail()
      .normalizeEmail(),
  ];
};

export const newPasswordRules = () => {
  return [
    body("password")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Must be minimum 6 and have at least one number, uppercase letter, lowercase letter, and a character"
      ),
    param("id", "A valid mongoose id is required").isMongoId(),
    param("token", "A token is required").isUUID(4),
  ];
};

export const resetPasswordLinkRules = () => {
  return [
    param("id", "A valid mongoose id is required").isMongoId(),
    param("token", "A token is required").isUUID(4),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const extractedErrors = {};
  errors.array().forEach((err) => {
    extractedErrors[err.param] = err.msg;
  });
  return responseHandler(res, "fail", 400, extractedErrors);
};

export { validate, userValidationRules };
