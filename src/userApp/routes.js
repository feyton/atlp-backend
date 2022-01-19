//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import { asyncHandler } from "../config/utils.js";
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
 *  securitySchemes:
 *    Token:
 *      type: http
 *      scheme: Bearer
 *      bearerFormat: JWT
 */

/**
 * @openapi
 * components:
 *  responses:
 *    UnauthorizedError:
 *      description: Access token is missing or invalid
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
 *              password: Atlp@123
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
 *              password: Atlp@123
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
 * /api/v1/accounts/signup:
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
 *          200:
 *              description: A user object is created and returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          #ref: "#/components/schemas/User"
 *          400:
 *              description: Invalid user input
 *              content:
 *                application/json:
 *                  schema:
 *                    error:
 *                      type: object
 *                      properties:
 *                        status:
 *                          type:string
 *                        data: 
 *                          type: object
 *                        code:
 *                          type: number
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
  asyncHandler(views.createUserView)
);

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
router.post(
  "/login",
  userValidationRules(),
  validate,
  validateLogin,
  asyncHandler(views.loginView)
);

/**
 * @swagger
 * /api/v1/accounts/profile/{id}:
 *   get:
 *     security:
 *       - Token: []
 *     summary: Retrieve a single JSONPlaceholder user.
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     tags:
 *         - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb user id. Returned when user signup.
 *     responses:
 *       401:
 *           $ref: "#/components/responses/UnauthorizedError"
 *
 */

router.get(
  "/profile/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(views.getUserView)
);

/**
 * @swagger
 * /api/v1/accounts/profile/{id}:
 *   put:
 *     security:
 *       - Token: []
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

 *     responses:
 *       200:
 *         description: A user was updated
 *       401:
 *           description: Missing a valid token to confirm access
 */
router.put(
  "/profile/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(views.updateUserView)
);

/**
 * @swagger
 * /api/v1/accounts/{id}:
 *   delete:
 *     security:
 *       - Token: []
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
 *           description: The user has been deleted
 *       401:
 *           description: Missing a valid token to confirm access
 */
router.delete(
  "/:id",
  verifyJWT,
  checkObjectId,
  asyncHandler(views.deleteUserView)
);

/**
 * @swagger
 * path:
 * /api/v1/accounts/logout:
 *   post:
 *     summary: Allow a user to logout
 *     description: A valid token is required to process request
 *     tags:
 *         - User
 *     responses:
 *         200:
 *             description: The request has been successful. No data to send
 *             content:
 *               application/json
 *         401:
 *             $ref: "#/components/responses/UnauthorizedError"
 *         403:
 *             description: User already signed out
 *         500:
 *             description: Server error. This is caused by server.
 *
 */

router.post("/logout", verifyJWT, asyncHandler(views.logoutView));

//write your routes here

//Keep this line at the bottom

export { router };
