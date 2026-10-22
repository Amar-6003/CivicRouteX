import express from "express";
import multer from "multer";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  uploadEvidence,
  getComplaintEvidence,
} from "../controllers/evidence.controller.js";

const router = express.Router();

router.use(authMiddleware);

const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    const safeName =
      file.originalname
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    const uniqueName =
      `${Date.now()}-${safeName}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (
      allowedTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG, WEBP and PDF files are allowed."
        )
      );
    }
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