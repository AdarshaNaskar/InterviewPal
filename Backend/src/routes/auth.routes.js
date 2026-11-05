const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a user
 * @access Public
 */
authRouter.post("/register", authController.register);

/**
 * @route POST /api/auth/login
 * @description Login User with email and pasword
 * @access Public
 */
authRouter.post("/login", authController.login);

/**
 * @route GET /api/auth/logout
 * @description clear token freom user cookie
 * @access Public
 */
authRouter.get("/logout", authController.logout);

/**
 * @route GET/api/auth/get-me
 * @description get the current logged in user detils
 * @access Private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMe);

/**
 * @route POST /api/auth/forgot-password
 * @description Request a password reset link
 * @access Public
 */
authRouter.post("/forgot-password", authController.forgotPassword);

/**
 * @route POST /api/auth/reset-password/:token
 * @description Reset password using rest token
 * @access Public
 */
authRouter.post("/reset-password/:token", authController.resetPassword);

module.exports = authRouter;
