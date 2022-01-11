//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";

const router = Router();

router.post("/login", views.loginView);
router.post("/signup", views.createUserView);
router.put("/profile/:id", views.updateUserView);
router.get("/profile/:id", views.getUserView);
router.delete("/:id", views.deleteUserView);

//write your routes here

//Keep this line at the bottom

export { router };
