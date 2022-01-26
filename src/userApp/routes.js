import { Router } from "express";
import { asyncHandler } from "../config/utils.js";
import { checkObjectId, validateLogin } from "./middleware.js";
import { verifyJWT } from "./utils.js";
import {
  userSignupValidationRules,
  userUpdateValidationRules,
  userValidationRules,
  validate,
} from "./validator.js";
import * as views from "./views.js";

const router = Router();

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
 *          201:
 *              $ref: "#/components/responses/createdResponse"
 *          400:
 *              $ref: "#/components/responses/badRequest"
 *          409:
 *              $ref: "#/components/responses/conflictResponse"
 *          500:
 *              $ref: "#/components/responses/serverError"
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
 *              $ref: "#/components/responses/successResponse"
 *
 *          400:
 *              $ref: "#/components/responses/badRequest"
 *
 *          500:
 *              $ref: "#/components/responses/serverError"
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
 *       200:
 *           $ref: "#/components/responses/successResponse"
 *       401:
 *           $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *           $ref: "#/components/responses/notFound"
 *       500:
 *           $ref: "#/components/responses/serverError"
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
 *       201:
 *         $ref: "#/components/responses/createdResponse"
 *       400:
 *           $ref: "#/components/responses/badRequest"
 *       401:
 *           $ref: "#/components/responses/UnauthorizedError"
 *       409:
 *           $ref: "#/components/responses/conflictResponse"
 *       500:
 *           $ref: "#/components/responses/serverError"
 */
router.put(
  "/profile/:id",
  verifyJWT,
  checkObjectId,
  userUpdateValidationRules(), validate,
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
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              required:
 *                - password
 *              properties:
 *                password:
 *                  type: string
 *                  example: Atlp@20220
 *
 *     responses:
 *       200:
 *           $ref: "#/components/responses/successResponse"
 *       400:
 *           $ref: "#/components/responses/badRequest"
 *       401:
 *           $ref: "#/components/responses/UnauthorizedError"
 *       500:
 *           $ref: "#/components/responses/serverError"
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
 *             $ref: "#/components/responses/successResponse"
 *         401:
 *             $ref: "#/components/responses/UnauthorizedError"
 *         403:
 *             $ref: "#/components/responses/forbidenError"
 *         500:
 *             $ref: "#/components/responses/serverError"
 *
 */

router.post("/logout", asyncHandler(views.logoutView));

//write your routes here

//Keep this line at the bottom

export { router };
