//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";
import { verifyJWT } from "../userApp/utils.js";
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
 *              id: 123456789
 *              title: Post 1
 *              summary: Here is the summary
 *              author: 123457383
 *              content: Here is content
 */

/**
 * @openapi
 * /blog:
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
router.get("/", views.getBlogsView);
/**
 * @openapi
 * /blog/cat:
 *   post:
 *     summary: Allow a user to create a category
 *     description: This require to be authenticated.
 *     tags:
 *         - Blog
 */
router.post("/cat", verifyJWT, views.createCategoryView);
/**
 * @openapi
 * /blog/:
 *   post:
 *     summary: Allow a user to create a new category
 *     description: Authenticated user can create a blog category
 *     tags:
 *         - Blog
 */
router.post("/", verifyJWT, views.createBlogView); //todo add validation before verification
/**
 * @openapi
 * /blog/{id}:
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
 */
router.get("/:id", views.getBlogDetailView);
/**
 * @openapi
 * /blog/{id}:
 *   delete:
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
 *         401:
 *             description: A blog post does not exist
 *         400:
 *             description: Missing the id in path
 */
router.delete("/:id", verifyJWT, views.deleteBlogView);
/**
 * @openapi
 * /blog/{id}:
 *   put:
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
 *         401:
 *             description: A blog post does not exist
 *         400:
 *             description: Missing blog id
 *         500:
 *             description: Server error
 *         403:
 *             description: The blog author is diffrent from the authenticated user
 */
router.put("/:id", verifyJWT, views.updateBlogView);

//Keep this line at the bottom

export { router };
