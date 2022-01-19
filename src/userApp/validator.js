import { body, validationResult } from "express-validator";
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
      .withMessage("You will need a valid email to signup")
      .custom(async (value) => {
        const duplicateEmail = await User.findOne({ email: value }).then(
          (user) => {
            if (user) return Promise.reject("Email is already taken");
          }
        );
      }),
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
const userValidationRules = () => {
  return [
    body("email", "A valid email is required").notEmpty().isEmail(),
    body("password", "Password is required").notEmpty(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  console.log(extractedErrors);
  console.log(req.body);
  return responseHandler(res, "fail", 400, extractedErrors);
};

export { validate, userValidationRules };
