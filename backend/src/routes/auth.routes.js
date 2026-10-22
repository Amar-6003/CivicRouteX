
import express from "express";

import {
  register,
  login,
  getMe,
  verifyEmail,
  checkVerificationStatus,
  updateProfile,
  uploadProfilePhoto,
  removeProfilePhoto,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import profileUpload from "../middleware/profileUpload.middleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.get("/verification-status", checkVerificationStatus);
router.post("/login", login);

router.get("/me", authMiddleware, getMe);

router.patch("/profile", authMiddleware, updateProfile);

router.post(
  "/profile/photo",
  authMiddleware,
  profileUpload.single("profilePhoto"),
  uploadProfilePhoto
);

router.delete(
  "/profile/photo",
  authMiddleware,
  removeProfilePhoto
);

export default router;
