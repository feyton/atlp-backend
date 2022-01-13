//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { validateSignUpData, verifyJWT } from "./utils.js";
import * as views from "./views.js";


const router = Router();

/**
 * @swagger
 * /account/login:
 *   post:
 *     summary: Allow a user to login using email and password
 *     description: A valid email and password is required to a
 */
router.post("/login", views.loginView);
router.post("/signup", validateSignUpData, views.createUserView);
router.put("/profile/:id", verifyJWT, views.updateUserView);
router.get("/profile/:id", verifyJWT, views.getUserView);
router.delete("/:id", verifyJWT, views.deleteUserView);
router.post("/logout", verifyJWT, views.logoutView);
// router.get("/refresh", views.refreshTokenView);

//write your routes here

//Keep this line at the bottom

export { router };
