/**
 * @openapi
 * /api/v1/refresh:
 *  get:
 *      summary: Refresh a user token
 *      description: Use this route to refresh a token for a logged in user.
 *      tags:
 *          - Index
 *      responses:
 *         200:
 *             description: A JSON object is returned with a new access Token
 *         403:
 *             description: Invalid/ Expired token is received
 *         400:
 *             description: Missing a JWT cookie in request header.
 *         500:
 *             description: Server error
 */
