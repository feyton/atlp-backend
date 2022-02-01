/**
 * @openapi
 * /api/v1/blogs:
 *   get:
 *     summary: Return a list of all blogs that are published
 *     description: Expected to return an array of posts objects
 *     tags:
 *         - Blog
 *
 *     responses:
 *         200:
 *             $ref: "#/components/responses/successResponse"
 *         500:
 *             $ref: "#/components/responses/serverError"
 */

/**
 * @openapi
 * /api/v1/blogs/cat:
 *   post:
 *     security:
 *       - Token: []
 *     summary: Allow a user to create a new category
 *     description: Authenticated user can create a blog category
 *     tags:
 *         - Blog
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: "#/components/schemas/Category"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/successResponse"
 *       400:
 *           $ref: "#/components/responses/badRequest"
 *       401:
 *           $ref: "#/components/responses/UnauthorizedError"
 *       409:
 *           $ref: "#/components/responses/conflictResponse"
 *       500:
 *           $ref: "#/components/responses/serverError"
 */

/**
 * @openapi
 * /api/v1/blogs/:
 *   post:
 *     security:
 *       - Token: []
 *
 *     summary: Allow a user to create a new blog post
 *     description: Authenticated user can create a blog post
 *     tags:
 *         - Blog
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: "#/components/schemas/Blog"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/successResponse"
 *       400:
 *         $ref: "#/components/responses/badRequest"
 *       401:
 *           $ref: "#/components/responses/UnauthorizedError"
 *       409:
 *           $ref: "#/components/responses/conflictResponse"
 *       500:
 *           $ref: "#/components/responses/serverError"
 */

/**
 * @openapi
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Allow a user to get a specific blog post
 *     description: Expect a response with a JSON object
 *     tags:
 *         - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb blog id.
 *     responses:
 *         200:
 *             $ref: "#/components/responses/successResponse"
 *         404:
 *             $ref: "#/components/responses/notFound"
 *         500:
 *           $ref: "#/components/responses/serverError"
 */

/**
 * @openapi
 * /api/v1/blogs/{id}:
 *   put:
 *     security:
 *       - Token: []
 *     summary: Allow a user to update a specific blogpost
 *     description: This require to be authenticated
 *     tags:
 *         - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb blog id.
 *         schema:
 *           $ref: "#components/Blog"

 *     responses:
 *         200:
 *             $ref: "#/components/responses/successResponse"
 *         400:
 *             $ref: "#/components/responses/badRequest"
 *         403:
 *             $ref: "#/components/responses/forbidenError"
 *         404:
 *             $ref: "#/components/responses/notFound"
 *         500:
 *             $ref: "#/components/responses/serverError"
 */

/**
 * @openapi
 * /api/v1/blogs/{id}:
 *   delete:
 *     security:
 *       - Token: []
 *     summary: Allow a user to delete a specific blog
 *     description: This require to be authenticated and be an owner of blog
 *     tags:
 *         - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A valid mongodb blog id.
 *     responses:
 *         200:
 *             $ref: "#/components/responses/successResponse"
 *         401:
 *             $ref: "#/components/responses/UnauthorizedError"
 *         403:
 *             $ref: "#/components/responses/forbidenError"
 *         404:
 *             $ref: "#/components/responses/notFound"
 *         500:
 *             $ref: "#/components/responses/serverError"

 */
