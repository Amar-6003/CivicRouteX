
import prisma from "../config/prisma.js";
import { getOfficialGuidance } from "../services/officialGuidance.service.js";

export const getComplaintGuidance = async (req, res) => {
  try {
    const complaintId = Number(req.params.id);
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
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const guidance = await getOfficialGuidance(complaint);

    return res.status(200).json({
      success: true,
      guidance,
    });
  } catch (error) {
    console.error("Official complaint guidance failed:", error.message);

    return res.status(503).json({
      success: false,
      message:
        "Official guidance is temporarily unavailable. Your saved complaint has not been deleted. Please try again later.",
    });
  }
};
