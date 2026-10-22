import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintByTrackingNumber,
  updateComplaintStatus,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createComplaint);

router.get("/", authMiddleware, getMyComplaints);

router.get("/:id", authMiddleware, getComplaintById);

router.put("/:id", authMiddleware, updateComplaint);

router.delete("/:id", authMiddleware, deleteComplaint);

router.get(
  "/tracking/:trackingNumber",
  authMiddleware,
  getComplaintByTrackingNumber,
);

router.patch("/:id/status", authMiddleware, updateComplaintStatus);

export default router;
