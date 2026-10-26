
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

import { getComplaintGuidance } from "../controllers/complaintGuidance.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createComplaint);

router.get("/", authMiddleware, getMyComplaints);

// Specific routes before the generic /:id route.
router.get(
  "/tracking/:trackingNumber",
  authMiddleware,
  getComplaintByTrackingNumber,
);

router.get("/:id/guidance", authMiddleware, getComplaintGuidance);

router.patch("/:id/status", authMiddleware, updateComplaintStatus);

router.get("/:id", authMiddleware, getComplaintById);

router.put("/:id", authMiddleware, updateComplaint);

router.delete("/:id", authMiddleware, deleteComplaint);

export default router;
