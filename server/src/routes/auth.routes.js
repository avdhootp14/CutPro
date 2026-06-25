import express from "express";
import {
  registerUser,
  registerPartner,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerification,
} from "../controllers/auth.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/register-partner").post(registerPartner);

router.post("/login", loginUser);

router.route("/verify-email/:token").get(verifyEmail);
router.route("/resend-verification").post(verifyJWT, resendVerification);

router.post("/logout", verifyJWT, logoutUser);

router.post("/refresh-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

router.get("/current-user", verifyJWT, getCurrentUser);

export default router;