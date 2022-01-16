import { body, check } from "express-validator";
import { blogModel, categoryModel } from "./models.js";

export const blogCreateValidationRules = () => {
  return [
    body(
      "title",
      "No posts without a title, and should be at least 5 characters"
    )
      .notEmpty()
      .isLength({ min: 5, max: 100 })
      .bail()
      .custom(async (value) => {
        return blogModel.findOne({ title: value }).then((title) => {
          if (title) {
            return Promise.reject("The title already exists");
          }
        });
      }),
    body(
      "summary",
      "A good summary should be at least 10 chars and not more than 300"
    ).isLength({ min: 10, maz: 300 }),
    body("content", "A good content is required > 10 chars").isLength({
      min: 10,
    }),
    body("published").optional().toBoolean(),
  ];
};
export const blogUpdateValidationRules = () => {
  return [
    check("title", "No posts without a title")
      .optional()
      .isLength({ min: 5, max: 100 }),
    body(
      "summary",
      "A good summary should be at least 10 chars and not more than 300"
    )
      .optional()
      .isLength({ min: 10, maz: 300 }),
    body("content", "A good content is required > 10 chars")
      .optional()
      .isLength({
        min: 10,
      }),
  ];
};

export const createCategoryValidationRules = () => {
  return [
    body("title", "A good title have 2 < chars > 10")
      .isLength({ min: 2, max: 20 })
      .bail()
      .custom(async (value) => {
        const exists = await categoryModel.findOne({ title: value }).exec();
        if (exists) return Promise.reject("The category already exists");
      }),
    body("description", "Description is required").notEmpty(),
  ];
};