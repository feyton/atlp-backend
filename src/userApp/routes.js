//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { verifyJWT } from "./utils.js";
import { validateSignUpData } from "./middleware.js";
import * as views from "./views.js";

const router = Router();

/**
 * @openapi
 * tags:
 *  name: User
 *  description: Routes for the user App
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *          properties:
 *              id:
 *                  type: string
 *                  description: The mongodb generated id of the individual user
 *              firstName:
 *                  type: string
 *                  description: user first name
 *              lastName:
 *                  type: string
 *                  description: User last name
 *              email:
 *                  type: email
 *                  description: A valid email
 *              password:
 *                  type: password
 *                  description: A user password.
 *              profile picture:
 *                  type: file
 *                  description: The user profile picture.
 *          example:
 *              id: 61e01d1bace455b47f8f19d5
 *              firstName: Fabrice
 *              lastName: Hafashimana
 *              email: info@me.com
 *              password: atlp123
 */

/**
 * @swagger
 * path:
 * /account/login:
 *   post:
 *     summary: Allow a user to login using email and password
 *     description: A valid email and password is required to a
 *     tags:
 *         - User

 *
 */
router.post("/login", views.loginView);

/**
 * @swagger
 * /account/signup:
 *   post:
 *     summary: Allow a user to register in the application
 *     description: Expecting JSON formatted data in request body
  *     tags:
 *         - User
 *     requestBody:
 *         required:true
 * 
 *     responses:
 *          200:
 *              description: A user object is returned

 */

router.post("/signup", validateSignUpData, views.createUserView);

/**
 * @swagger
 * /account/profile/{id}:
 *   get:
 *     summary: Retrieve a single JSONPlaceholder user.
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     tags:
 *         - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb user id. Returned when user signup.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         ...
 */
router.put("/profile/:id", verifyJWT, views.updateUserView);

/**
 * @swagger
 * /account/profile/{id}:
 *   get:
 *     summary: Retrieve a single JSONPlaceholder user.
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     tags:
 *         - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb user id. Returned when user signup.
 *         schema:
 *           $ref: "#components/User"
 *     responses:
 *       200:
 *         ...
 */

router.get("/profile/:id", verifyJWT, views.getUserView);

/**
 * @swagger
 * /account/{id}:
 *   delete:
 *     summary: Delete a user specified in the id.
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     tags:
 *         - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb user id. Returned when user signup.
 *         schema:
 *           $ref: "#components/User"
 *     responses:
 *       200:
 *         ...
 */
router.delete("/:id", verifyJWT, views.deleteUserView);

/**
 * @swagger
 * path:
 * /account/logout:
 *   post:
 *     summary: Allow a user to logout
 *     description: A valid token is required to process request
 *     tags:
 *         - User

 *
 */

router.post("/logout", verifyJWT, views.logoutView);

//write your routes here

//Keep this line at the bottom

export { router };
