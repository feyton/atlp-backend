/**
 * @openapi
 * /api/v1/contacts:
 *   get:
 *     security:
 *       - Token: []
 *     summary: Return a list of all open queries
 *     description: Expected to return an array of queries
 *     tags:
 *         - Admin
 *
 *     responses:
 *         200:
 *             $ref: "#/components/responses/successResponse"
 *         401:
 *             $ref: "#/components/responses/UnauthorizedError"
 *         500:
 *             $ref: "#/components/responses/serverError"
 */