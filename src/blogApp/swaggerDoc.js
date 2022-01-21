// Tags

/**
 * @openapi
 * tags:
 *  name: Blog
 *  description: Routes for the user App
 */

/**
 * @openapi
 * tags:
 *  name: Index
 *  description: Routes for the user App
 */

// ------------------ // -----------//

// Models

/**
 * @openapi
 * components:
 *  schemas:
 *      Blog:
 *          type: object
 *          required:
 *              - title
 *              - summary
 *              - content
 *          properties:
 *              id:
 *                  type: string
 *                  description: The mongodb generated id of the individual blog post
 *              title:
 *                  type: string
 *                  description: The blog post title and must be unique
 *              summary:
 *                  type: string
 *                  description: The summary of the post. Not more than 200 words.
 *              content:
 *                  type: string
 *                  description: The content of the blog post.
 *          example:
 *              title: A new post title
 *              summary: Here is the summary that must be above 10 chars
 *              content: Here is content, just make it rich
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          required:
 *              - title
 *              - desc
 *          properties:
 *              title:
 *                  type: string
 *                  description: The blog post title and must be unique
 *              desc:
 *                  type: string
 *                  description: The summary of the post. Not more than 200 words.
 *          example:
 *              title: Tutorials
 *              desc: For tech savvy
 */

//--------------------//--------------//
