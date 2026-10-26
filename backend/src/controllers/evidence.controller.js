import prisma from "../config/prisma.js";
import {
  uploadBufferToCloudinary,
  deleteCloudinaryAsset,
} from "../config/cloudinary.js";

export const uploadEvidence = async (req, res) => {
  const uploadedAssets = [];

  try {
    const complaintId = Number(req.params.complaintId);
    const userId = Number(req.user?.id ?? req.user?.userId);

    if (
      !Number.isInteger(complaintId) ||
      complaintId <= 0 ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint or user ID.",
      });
    }

    const complaint = await prisma.complaint.findFirst({
      where: {
        id: complaintId,
        userId,
      },
      select: { id: true },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    // Upload each file to Cloudinary.
    for (const file of req.files) {
      const asset = await uploadBufferToCloudinary(file.buffer, {
        folder: "civicroutex/evidence",
        resourceType: "auto",
      });

      uploadedAssets.push({
        fileName: file.originalname,
        fileUrl: asset.secure_url,
        fileType: file.mimetype,
        complaintId,
        publicId: asset.public_id,
        resourceType: asset.resource_type,
      });
    }

    // Store the Cloudinary URLs in the existing Evidence table.
    const evidences = await prisma.$transaction(
      uploadedAssets.map((asset) =>
        prisma.evidence.create({
          data: {
            fileName: asset.fileName,
            fileUrl: asset.fileUrl,
            fileType: asset.fileType,
            complaintId: asset.complaintId,
          },
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully.",
      evidences,
    });
  } catch (error) {
    console.error("Evidence upload error:", error);

    // If database saving fails, clean up files uploaded during this request.
    await Promise.allSettled(
      uploadedAssets.map((asset) =>
        deleteCloudinaryAsset(
          asset.publicId,
          asset.resourceType
        )
      )
    );

    return res.status(500).json({
      success: false,
      message: "Evidence upload failed.",
    });
  }
};

export const getComplaintEvidence = async (req, res) => {
  try {
    const complaintId = Number(req.params.complaintId);
    const userId = Number(req.user?.id ?? req.user?.userId);

    if (
      !Number.isInteger(complaintId) ||
      complaintId <= 0 ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint or user ID.",
      });
    }

    const complaint = await prisma.complaint.findFirst({
      where: {
        id: complaintId,
        userId,
      },
      select: { id: true },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const evidences = await prisma.evidence.findMany({
      where: { complaintId },
      orderBy: { createdAt: "asc" },
    });

    return res.json({
      success: true,
      evidences,
    });
  } catch (error) {
    console.error("Get evidence error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch evidence.",
    });
  }
};