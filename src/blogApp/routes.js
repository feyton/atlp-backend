//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";
import { verifyJWT } from "../userApp/utils.js";
const router = Router();

//write your routes here
router.get("/", views.getBlogsView);
router.post("/cat", verifyJWT, views.createCategoryView);
router.post("/", verifyJWT, views.createBlogView);
router.get("/:id", views.getBlogDetailView);
router.delete("/:id", verifyJWT, views.deleteBlogView);
router.put("/:id", verifyJWT, views.updateBlogView);

//Keep this line at the bottom

export { router };
