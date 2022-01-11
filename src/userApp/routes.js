//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { verifyJWT } from "./utils.js";
import * as views from "./views.js";

const router = Router();

router.post("/login", views.loginView);
router.post("/signup", views.createUserView);
router.put("/profile/:id", verifyJWT, views.updateUserView);
router.get("/profile/:id", verifyJWT, views.getUserView);
router.delete("/:id", verifyJWT, views.deleteUserView);
router.post("/logout", verifyJWT, views.logoutView);
// router.get("/refresh", views.refreshTokenView);

//write your routes here

//Keep this line at the bottom

export { router };
