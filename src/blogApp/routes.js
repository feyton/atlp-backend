//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { asyncHandler } from "../config/utils.js";
import { checkObjectId } from "../userApp/middleware.js";
import { verifyJWT } from "../userApp/utils.js";
import { validate } from "../userApp/validator.js";
import {
  blogCreateValidationRules,
  blogUpdateValidationRules,
  createCategoryValidationRules,
} from "./validator.js";
import * as views from "./views.js";
const router = Router();

//write your routes here

/**
 * @openapi
 * tags:
 *  name: Blog
 *  description: Routes for the user App
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      Blog:
 *          type: object
 *          required:
 *              title
 *              summary
 *              content
 *          properties:
 *              id:
 *                  type: string
 *                  description: The mongodb generated id of the individual book
 *              title:
 *                  type: string
 *                  description: The blog post title and must be unique
 *              summary:
 *                  type: string
 *                  description: The summary of the post. Not more than 200 words.
 *              author:
 *                  type: Object
 *                  description: The post author will be set as the logged in user.
 *              content:
 *                  type: string
 *                  description: The content of the blog post.
 *          example:
 *              title: Post 1
 *              summary: Here is the summary
 *              content: Here is content
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          required:
 *              title
 *              desc
 *          properties:
 *              id:
 *                  type: string
 *                  description: The mongodb generated id of the individual book
 *              title:
 *                  type: string
 *                  description: The blog post title and must be unique
 *              desc:
 *                  type: string
 *                  description: The summary of the post. Not more than 200 words.
 *          example:
 *              title: Tutorials
 *              desc: For tech savvy
 */

/**
 * @openapi
 * /api/v1/blogs:
 *   get:
 *     summary: Return a list of all blogs that are published
 *     description: Expected to return an array of posts objects
 *     tags:
 *         - Blog
 *
 *     responses:
 *         200:
 *             description: A list of post objects
 *         201:
 *             description: No posts created yet
 *         500:
 *             description: Server error/Not able to retrive the data
 */
router.get("/", asyncHandler(views.getBlogsView));
/**
 * @openapi
 * /api/v1/blogs/cat:
 *   post:
 *     security:
 *       - Token: []
 *     summary: Allow a user to create a new category
 *     description: Authenticated user can create a blog category
 *     tags:
 *         - Blog
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: "#/components/schemas/Category"
 *     responses:
 *       200:
 *         description: A user was updated
 *       401:
 *           description: Missing a valid token to confirm access
 */

router.post(
  "/cat",
  verifyJWT,
  createCategoryValidationRules(),
  validate,
  asyncHandler(views.createCategoryView)
);
/**
 * @openapi
 * /api/v1/blogs/:
 *   post:
 *     security:
 *       - Token: []
 *
 *     summary: Allow a user to create a new blog post
 *     description: Authenticated user can create a blog post
 *     tags:
 *         - Blog
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: "#/components/schemas/Blog"
 *     responses:
 *       200:
 *         description: A user was updated
 *       401:
 *           description: Missing a valid token to confirm access
 *       409:
 *           description: Title already exists and there is conflict
 */
router.post(
  "/",
  verifyJWT,
  blogCreateValidationRules(),
  validate,
  views.createBlogView
);

/**
 * @openapi
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Allow a user to get a specific blog post
 *     description: Expect a response with a JSON object
 *     tags:
 *         - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb blog id.
 *         schema:
 *           $ref: "#components/Blog"

 *     responses:
 *         200:
 *             description: A blog post is returned as JSON
 *         404:
 *             description: A blog post does not exist
 *         400:
 *             description: Missing the id in path
 *         500:
 *           description: Something terribly happened to our end
 */
router.get("/:id", checkObjectId, asyncHandler(views.getBlogDetailView));

/**
 * @openapi
 * /api/v1/blogs/{id}:
 *   put:
 *     security:
 *       - Token: []
 *     summary: Allow a user to update a specific blogpost
 *     description: This require to be authenticated
 *     tags:
 *         - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb blog id.
 *         schema:
 *           $ref: "#components/Blog"

 *     responses:
 *         200:
 *             description: A blog post is updated and is returned as JSONPlaceholder object
 *         404:
 *             description: A blog post you are trying to edit does not exist
 *         400:
 *             description: Missing blog id
 *         500:
 *             description: Server error
 *         403:
 *             description: The blog author is diffrent from the authenticated user
 */
router.put(
  "/:id",
  verifyJWT,
  checkObjectId,
  blogUpdateValidationRules(),
  validate,
  views.updateBlogView
);

/**
 * @openapi
 * /api/v1/blogs/{id}:
 *   delete:
 *     security:
 *       - Token: []
 *     summary: Allow a user to delete a specific blog
 *     description: This require to be authenticated and be an owner of blog
 *     tags:
 *         - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb blog id.
 *         schema:
 *           $ref: "#components/Blog"
 *     responses:
 *         200:
 *             description: A blog post is deleted
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             status: string
 *                             code: int
 *                             data: null
 *         404:
 *             description: A blog post does not exist
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             status: string
 *                             code: int
 *                             message: string
 *         400:
 *             description: Missing the id in path
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             status: string
 *                             code: int
 *                             message: string
 *         401:
 *             description: Missing a valid token
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             status: string
 *                             code: int
 *                             message: string

 */
router.delete("/:id", verifyJWT, checkObjectId, views.deleteBlogView);

//Keep this line at the bottom

export { router };
