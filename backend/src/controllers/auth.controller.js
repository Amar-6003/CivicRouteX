
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import prisma from "../config/prisma.js";
import { sendVerificationEmail } from "../services/email.service.js";

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  profilePhoto: true,
  createdAt: true,
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        verificationExpiresAt,
      },
    });

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const verificationUrl =
      `${frontendUrl}/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        verificationUrl,
      });
    } catch (emailError) {
      console.error("Verification email failed:", emailError);

      await prisma.user.delete({
        where: { id: user.id },
      });

      return res.status(500).json({
        success: false,
        message:
          "Account could not be created because the verification email could not be sent.",
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification link.",
      });
    }

    if (user.emailVerified) {
      return res.json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified. You can log in.",
      });
    }

    if (
      !user.verificationExpiresAt ||
      user.verificationExpiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification link has expired. Please request a new one.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationExpiresAt: null,
      },
    });

    const tokenJwt = generateToken(updatedUser);

    return res.json({
      success: true,
      message: "Email verified successfully.",
      token: tokenJwt,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Email verification failed.",
    });
  }
};

export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { emailVerified: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error("Verification status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check verification status.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        emailVerified: false,
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: profileSelect,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Fetch user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters.",
      });
    }

    if (
      typeof phone !== "string" ||
      typeof address !== "string" ||
      typeof city !== "string" ||
      typeof state !== "string" ||
      typeof pincode !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "All profile fields must be sent as text.",
      });
    }

    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();
    const cleanState = state.trim();
    const cleanPincode = pincode.trim();

    if (cleanPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.",
      });
    }

    if (cleanAddress.length > 300) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 300 characters.",
      });
    }

    if (!cleanCity || cleanCity.length > 100) {
      return res.status(400).json({
        success: false,
        message: "City is required and must not exceed 100 characters.",
      });
    }

    if (!cleanState || cleanState.length > 100) {
      return res.status(400).json({
        success: false,
        message: "State is required and must not exceed 100 characters.",
      });
    }

    if (cleanPincode && !/^[1-9]\d{5}$/.test(cleanPincode)) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid 6-digit Indian PIN code starting with 1–9.",
      });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: cleanName,
        phone: cleanPhone || null,
        address: cleanAddress || null,
        city: cleanCity,
        state: cleanState,
        pincode: cleanPincode || null,
      },
      select: profileSelect,
    });

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a profile photo.",
      });
    }

    const profilePhoto = `/uploads/profiles/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePhoto },
      select: profileSelect,
    });

    return res.json({
      success: true,
      message: "Profile photo updated successfully.",
      profilePhoto: user.profilePhoto,
      user,
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }

    console.error("Upload profile photo error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload profile photo.",
    });
  }
};

export const removeProfilePhoto = async (req, res) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { profilePhoto: true },
    });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePhoto: null },
      select: profileSelect,
    });

    const oldPhoto = existingUser?.profilePhoto;

    if (oldPhoto?.startsWith("/uploads/profiles/")) {
      const filename = path.basename(oldPhoto);
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "profiles",
        filename
      );

      await fs.promises.unlink(filePath).catch((error) => {
        if (error.code !== "ENOENT") {
          console.error("Could not delete old profile photo:", error);
        }
      });
    }

    return res.json({
      success: true,
      message: "Profile photo removed successfully.",
      user,
    });
  } catch (error) {
    console.error("Remove profile photo error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove profile photo.",
    });
  }
};
