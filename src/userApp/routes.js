//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { checkObjectId, validateLogin } from "./middleware.js";
import { verifyJWT } from "./utils.js";
import {
  userSignupValidationRules,
  userValidationRules,
  validate,
} from "./validator.js";
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
 *          example:
 *              firstName: Fabrice
 *              lastName: Hafashimana
 *              email: info@me.com
 *              password: atlp123
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
 *                  type: string
 *                  description: A valid email
 *              password:
 *                  type: string
 *                  description: A user password.
 *              profile picture:
 *                  type: file
 *                  description: The user profile picture.

 */

/**
 * @openapi
 * components:
 *  schemas:
 *      LoginInfo:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          example:
 *              email: info@me.com
 *              password: atlp123
 *          properties:
 *              email:
 *                  type: string
 *                  description: A valid email
 *              password:
 *                  type: string
 *                  description: A user password.

 */

/**
 * @swagger
 * path:
 * /api/v1/accounts/login:
 *   post:
 *     summary: Allow a user to login using email and password
 *     description: A valid email and password is required to a
 *     tags:
 *         - User
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: "#/components/schemas/LoginInfo"
 *
 *     responses:
 *          200:
 *              description: A token is returned. Copy The token and use it on authentication
 *
 *          400:
 *              description: Missing required information in the request body
 *
 *          406:
 *              description: Wrong credentials were received. Check your email or password.
 *
 */
router.post("/login", userValidationRules(), validate, validateLogin);


/**
 * @swagger
 * /api/v1/account/signup:
 *   post:
 *     summary: Allow a user to register in the application
 *     description: Expecting JSON formatted data in request body
  *     tags:
 *         - User
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: "#/components/schemas/User"
 * 
 *     responses:
 *          201:
 *              description: A user object is created and returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          #ref: "#/components/schemas/User"
 *          400:
 *              description: Request missing required information
 *          406:
 *              description: Invalid data were received
 *          409:
 *              description: Sent email conflict with other user.
 *          500:
 *              description: Something went terribly wrong on our end.

 */

router.post(
  "/signup",
  userSignupValidationRules(),
  validate,
  views.createUserView
);

/**
 * @swagger
 * /api/v1/account/profile/{id}:
 *   put:
 *     summary: Update an individual User.
 *     description: Find and update the currently authenticated user with a valid token.
 *     tags:
 *         - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb user id. Returned when user signup.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: A token given to a user when they login. Copy and paste here
 *         schema:
 *           type: string
 *           format: token
 *     responses:
 *       200:
 *         description: A user was updated
 *       401:
 *           description: Missing a valid token to confirm access
 */
router.put("/profile/:id", verifyJWT, checkObjectId, views.updateUserView);

/**
 * @swagger
 * /api/v1/account/profile/{id}:
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
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: A token given to a user when they login. Copy and paste here
 *         schema:
 *           type: string
 *           format: token
 *     responses:
 *       401:
 *           description: Missing a valid token to confirm access
 */

router.get("/profile/:id", verifyJWT, checkObjectId, views.getUserView);

/**
 * @swagger
 * /api/v1/account/{id}:
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
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: A token given to a user when they login. Copy and paste here
 *         schema:
 *           type: string
 *           format: token
 *     responses:
 *       200:
 *           description: The user has been deleted
 *       401:
 *           description: Missing a valid token to confirm access
 */
router.delete("/:id", verifyJWT, checkObjectId, views.deleteUserView);

/**
 * @swagger
 * path:
 * /api/v1/account/logout:
 *   post:
 *     summary: Allow a user to logout
 *     description: A valid token is required to process request
 *     tags:
 *         - User
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: A token given to a user when they login. Copy and paste here
 *         required: true
 *         schema:
 *           type: string
 *           format: token
 *     responses:
 *         204:
 *             description: The request has been successful. No content to send
 *         401:
 *             description: Missing a valid token to confirm access
 *
 */

router.post("/logout", verifyJWT, views.logoutView);

//write your routes here

//Keep this line at the bottom

export { router };
