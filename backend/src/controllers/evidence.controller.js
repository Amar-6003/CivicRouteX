import prisma from "../config/prisma.js";

/*
 * =========================================================
 * UPLOAD EVIDENCE
 * =========================================================
 */

export const uploadEvidence = async (
  req,
  res
) => {
  try {
    const complaintId =
      Number(req.params.complaintId);

    const userId =
      req.user?.id ??
      req.user?.userId;

    if (
      !Number.isInteger(complaintId) ||
      complaintId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid complaint ID.",
      });
    }

    const complaint =
      await prisma.complaint.findFirst({
        where: {
          id: complaintId,
          userId: Number(userId),
        },
      });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message:
          "Complaint not found.",
      });
    }

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No files uploaded.",
      });
    }

    const evidences =
      await prisma.$transaction(
        req.files.map((file) =>
          prisma.evidence.create({
            data: {
              fileName:
                file.originalname,

              fileUrl:
                `/uploads/${file.filename}`,

              fileType:
                file.mimetype,

              complaintId,
            },
          })
        )
      );

    return res.status(201).json({
      success: true,
      message:
        "Evidence uploaded successfully.",
      evidences,
    });
  } catch (error) {
    console.error(
      "Evidence upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Evidence upload failed.",
    });
  }
};

/*
 * =========================================================
 * GET EVIDENCE
 * =========================================================
 */

export const getComplaintEvidence = async (
  req,
  res
) => {
  try {
    const complaintId =
      Number(req.params.complaintId);

    const userId =
      req.user?.id ??
      req.user?.userId;

    const complaint =
      await prisma.complaint.findFirst({
        where: {
          id: complaintId,
          userId: Number(userId),
        },
      });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message:
          "Complaint not found.",
      });
    }

    const evidences =
      await prisma.evidence.findMany({
        where: {
          complaintId,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    return res.json({
      success: true,
      evidences,
    });
  } catch (error) {
    console.error(
      "Get evidence error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch evidence.",
    });
  }
};