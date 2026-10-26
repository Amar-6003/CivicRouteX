import express from "express";
import multer from "multer";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  uploadEvidence,
  getComplaintEvidence,
} from "../controllers/evidence.controller.js";

const router = express.Router();

router.use(authMiddleware);

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },

  fileFilter: (_req, file, callback) => {
    if (allowedTypes.has(file.mimetype)) {
      return callback(null, true);
    }

    const error = new Error(
      "Only JPG, PNG, WEBP and PDF files are allowed."
    );

    error.status = 400;
    callback(error);
  },
});

router.post(
  "/:complaintId",
  upload.array("files", 5),
  uploadEvidence
);

router.get(
  "/:complaintId",
  getComplaintEvidence
);

export default router;