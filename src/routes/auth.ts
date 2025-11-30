import { Router } from "express";
import { AuthenticationController } from "../controllers/authController";

const router = Router();

/**
 * @openapi
 * /auth/signin:
 *   post:
 *     summary: Sign in to an existing account
 *     description: Authenticates a user with email and password, returning a JWT token on success.
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mySecurePassword123"
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE2NzMwMDAwMDB9.abc123def456"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid email"
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             example:
 *               error: "Authentication failed. Please check your email and/or password and try again."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "An unexpected error has occurred."
 */
router.post("/signin", AuthenticationController.signIn);

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Registers a new user with email, password, first name, and last name.
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "mySecurePassword123"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Sucessfully Signed up"
 *               user:
 *                 userId: 42
 *                 email: "newuser@example.com"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - field: "email"
 *                   message: "Invalid email"
 *                 - field: "password"
 *                   message: "String must contain at least 8 character(s)"
 *       409:
 *         description: Conflict (unique or null constraint failed)
 *         content:
 *           application/json:
 *             examples:
 *               duplicateEmail:
 *                 summary: Duplicate email
 *                 value:
 *                   error:
 *                     reason: "Unique constraint failed"
 *                     message: "An account with this email already exists"
 *               nullConstraint:
 *                 summary: Null constraint violation
 *                 value:
 *                   error:
 *                     reason: "Null constraint failed"
 *                     message: "User requires an email"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "Unexpected error"
 */
router.post("/signup", AuthenticationController.signUp);

export default router;
