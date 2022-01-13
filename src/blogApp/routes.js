//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";
import { verifyJWT } from "../userApp/utils.js";
const router = Router();

//write your routes here

/**
 * @openapi
 * /blog/:
 *   get:
 *     summary: Return a list of all blogs that are published
 *     description: Expected to return an array of posts objects
 */
router.get("/", views.getBlogsView);
/**
 * @openapi
 * /blog/cat:
 *   post:
 *     summary: Allow a user to create a category
 *     description: This require to be authenticated.
 */
router.post("/cat", verifyJWT, views.createCategoryView);
/**
 * @openapi
 * /blog/:
 *   post:
 *     summary: Allow a user to create a post
 *     description: The view check if the user is authenticated and expects a body
 */
router.post("/", verifyJWT, views.createBlogView); //todo add validation before verification
/**
 * @openapi
 * /blog/{id}:
 *   get:
 *     summary: Allow a user to get a specific blog post
 *     description: Expect a response with a JSON object
 */
router.get("/:id", views.getBlogDetailView);
/**
 * @openapi
 * /blog/{id}:
 *   delete:
 *     summary: Allow a user to delete a specific blog
 *     description: This require to be authenticated
 */
router.delete("/:id", verifyJWT, views.deleteBlogView);
/**
 * @openapi
 * /blog/{id}:
 *   put:
 *     summary: Allow a user to update a specific blogpost
 *     description: This require to be authenticated
 */
router.put("/:id", verifyJWT, views.updateBlogView);

//Keep this line at the bottom

export { router };
