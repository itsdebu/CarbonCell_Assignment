const express = require("express");
const router = express.Router();
const { signup, login, logout, checkLoggedIn } = require("../Controllers/userController")
const { editProfile } = require("../Controllers/AuthenticateUser");
const { validateToken } = require("../Middleware/validateToken");

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       bio:
 *         type: string
 */

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             token:
 *               type: string
 *             success:
 *               type: boolean
 *       '400':
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.post("/signup", signup)

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             token:
 *               type: string
 *             success:
 *               type: boolean
 *       '400':
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.post("/login", login)

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout user
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       '401':
 *         description: Unauthorized
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.post("/logout", validateToken, logout)


/**
 * @swagger
 * /api/user/check:
 *   get:
 *     summary: Check if user is logged in
 *     description: |
 *       Retrieves the current user's information if they are logged in. Requires a valid JWT token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User is logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating user is logged in
 *                 user:
 *                   $ref: '#/definitions/User'
 *       '401':
 *         description: Unauthorized. User is not logged in or provided JWT token is invalid.
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *         description: Enter a valid JWT token obtained after successful login. Click on the 'Authorize' button below and enter the JWT token prefixed with 'Bearer '.
 */

// Endpoint implementation remains unchanged
router.get("/check", validateToken, checkLoggedIn);


/**
 * @swagger
 * /api/user/editprofile:
 *   post:
 *     summary: Edit user profile
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User profile data to be edited
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             bio:
 *               type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             user:
 *               $ref: '#/definitions/User'
 *       400:
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.post("/editprofile", validateToken, editProfile)

module.exports = router;