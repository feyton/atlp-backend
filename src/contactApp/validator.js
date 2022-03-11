import { body } from "express-validator";

export const contactCreateRules = () => {
  return [
    body("message", "A good message must have 5 to 300 characters.")
      .notEmpty()
      .isLength({
        min: 5,
        max: 300,
      }),
    body("email", "We need a varied email to get to you")
      .isEmail()
      .normalizeEmail(),
    body("name", "We need a good name to know you better.").isLength({
      min: 3,
      max: 30,
    }),
  ];
};

export const replyMessageValidationRules = () => {
  return [
    body("reply", "A good message is required at leat 5 to 200 chars").isLength(
      { min: 5, max: 300 }
    ),
  ];
};
