//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";
const router = Router();

//write your routes here
router.get("/", views.getBlogsView);
router.post("/cat", views.createCategoryView);
router.post("/", views.createBlogView);
router.get("/:id", views.getBlogDetailView);
router.delete("/:id", views.deleteBlogView);
router.put("/:id", views.updateBlogView);

//Keep this line at the bottom

export { router };
