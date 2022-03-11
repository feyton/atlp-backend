import { body } from "express-validator";

export const taskCreateRules = () => {
  return [
    body("body", "Activity required.").notEmpty().isLength({
      min: 3,
      max: 300,
    }),
  ];
};
