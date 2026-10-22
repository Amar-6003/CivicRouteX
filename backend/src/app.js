import path from "path";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import evidenceRoutes from "./routes/evidence.routes.js";
import lgdRoutes from "./routes/lgd.routes.js";

import authorityRoutes from "./routes/authority.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://civicroutex.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Serve uploaded files from backend/uploads.
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CivicRouteX backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/lgd", lgdRoutes);

app.use("/api/authorities", authorityRoutes);

// Global error handler.
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  if (
    error instanceof Error &&
    (error.message?.includes("Only JPG") ||
      error.message?.includes("Unsupported image type") ||
      error.message?.includes("Only JPG, PNG"))
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size must be 5 MB or smaller.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

export default app;