import { Router } from "express";
import { cloudinaryMiddleware, upload } from "../config/base.js";
import { asyncHandler } from "../config/utils.js";
import { checkObjectId } from "../userApp/middleware.js";
import { verifyJWT } from "../userApp/utils.js";
import { validate } from "../userApp/validator.js";
import {
  blogCreateValidationRules,
  blogUpdateValidationRules,
  commentValidation,
  createCategoryValidationRules,
} from "./validator.js";
import * as views from "./views.js";
const router = Router();

router.get("/", asyncHandler(views.getBlogsView));
router.get("/search", asyncHandler(views.blogSearchAdmin));
router.post("/admin-actions", verifyJWT, asyncHandler(views.blogAdminActions));
router.get("/admin", verifyJWT, asyncHandler(views.getBlogsViewAdmin));
router.post(
  "/comment/:id",
  checkObjectId,
  verifyJWT,
  commentValidation(),
  validate,
  views.addCommentView
);
router.get("/comment/:id", checkObjectId, verifyJWT, views.handleCommentAction);

router.post(
  "/cat",
  verifyJWT,
  createCategoryValidationRules(),
  validate,
  asyncHandler(views.createCategoryView)
);
router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  blogCreateValidationRules(),
  validate,
  cloudinaryMiddleware,
  asyncHandler(views.createBlogView)
);

router.get("/:id", checkObjectId, asyncHandler(views.getBlogDetailView));

router.put(
  "/:id",
  verifyJWT,
  checkObjectId,
  upload.single("image"),
  blogUpdateValidationRules(),
  validate,
  cloudinaryMiddleware,
  asyncHandler(views.updateBlogView)
);
router.delete(
  "/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(views.deleteBlogView)
);

//Keep this line at the bottom

export { router };
