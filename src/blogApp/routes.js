//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";
const router = Router();

//write your routes here
router.get("/")
router.post("/:uid", views.createBlogView);
router.get("/:uid", views.getBlogDetailView);
router.delete("/:id", views.deleteBlogView);
router.put("/:uid", views.updateBlogView);


//Keep this line at the bottom

export { router };
