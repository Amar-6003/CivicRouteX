import prisma from "../config/prisma.js";

import { detectCategory } from "../utils/complaintCategory.js";
import { detectGovernmentLevel } from "../utils/complaintScope.js";
import { routeComplaint } from "../services/routing.service.js";
import { detectPriority } from "../utils/complaintPriority.js";

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

/*
 * =========================================================
 * CREATE COMPLAINT
 * =========================================================
 */

export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      city,
      district,
      state,
      address,
      latitude,
      longitude,
    } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint title is required.",
      });
    }

    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint description is required.",
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Complaint title cannot exceed 200 characters.",
      });
    }

    if (description.trim().length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Complaint description cannot exceed 10000 characters.",
      });
    }

    const userId = Number(req.user?.id ?? req.user?.userId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    // Clean the text BEFORE using it for priority detection.
    const cleanedTitle = title.trim();
    const cleanedDescription = description.trim();

    const complaintPriority = detectPriority(cleanedTitle, cleanedDescription);

    if (!VALID_PRIORITIES.includes(complaintPriority)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid priority. Allowed values: LOW, MEDIUM, HIGH, CRITICAL.",
      });
    }

    const parseCoordinate = (value, field, min, max) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }

      if (typeof value !== "number" && typeof value !== "string") {
        throw new Error(`Invalid ${field}.`);
      }

      const parsed = Number(value);

      if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
        throw new Error(`${field} must be between ${min} and ${max}.`);
      }

      return parsed;
    };

    let parsedLatitude;
    let parsedLongitude;

    try {
      parsedLatitude = parseCoordinate(latitude, "latitude", -90, 90);
      parsedLongitude = parseCoordinate(longitude, "longitude", -180, 180);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message,
      });
    }

    if ((parsedLatitude === null) !== (parsedLongitude === null)) {
      return res.status(400).json({
        success: false,
        message: "Provide both latitude and longitude.",
      });
    }

    const cleanLocationField = (value, field, maxLength = 200) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }

      if (typeof value !== "string" || value.trim().length > maxLength) {
        throw new Error(`Invalid ${field}.`);
      }

      return value.trim() || null;
    };

    let manualCity;
    let manualDistrict;
    let manualState;
    let manualAddress;

    try {
      manualCity = cleanLocationField(city, "city");
      manualDistrict = cleanLocationField(district, "district");
      manualState = cleanLocationField(state, "state");
      manualAddress = cleanLocationField(address, "address", 500);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message,
      });
    }

    const category = detectCategory(cleanedTitle, cleanedDescription);

    const governmentLevel = detectGovernmentLevel(
      cleanedTitle,
      cleanedDescription,
      category,
    );

    const routing = await routeComplaint({
      category,
      governmentLevel,
      state: manualState,
      district: manualDistrict,
      city: manualCity,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    });

    const resolvedLocation = routing.resolvedLocation || null;

    const finalCity = resolvedLocation?.city || manualCity;
    const finalDistrict = resolvedLocation?.district || manualDistrict;
    const finalState = resolvedLocation?.state || manualState;
    const finalAddress = resolvedLocation?.displayName || manualAddress;

    const routingStatus = routing.routingStatus || "UNVERIFIED";

    const timelineMessage =
      routingStatus === "ROUTED" && routing.authority?.verified
        ? `Complaint recorded and matched to ${routing.authority.name}. This does not confirm submission to the authority's official system.`
        : "Complaint recorded in CivicRouteX. A verified official authority or submission channel has not been confirmed.";

    // Create complaint and initial timeline atomically.
    const complaint = await prisma.$transaction(async (tx) => {
      return tx.complaint.create({
        data: {
          title: cleanedTitle,
          description: cleanedDescription,
          category,
          governmentLevel,
          status: "SUBMITTED",
          priority: complaintPriority,
          city: finalCity,
          district: finalDistrict,
          state: finalState,
          address: finalAddress,
          latitude: parsedLatitude,
          longitude: parsedLongitude,
          routingStatus,
          routingReason: routing.reason || null,
          authorityName: routing.authority?.verified
            ? routing.authority.name
            : null,
          authorityEmail: null,
          user: {
            connect: { id: userId },
          },
          timeline: {
            create: {
              status: "SUBMITTED",
              message: timelineMessage,
            },
          },
        },
        include: {
          timeline: { orderBy: { createdAt: "asc" } },
          evidence: { orderBy: { createdAt: "asc" } },
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully in CivicRouteX.",
      complaint,
      classification: {
        category,
        governmentLevel,
      },
      routing: {
        routingStatus,
        reason: routing.reason,
        authority: routing.authority?.verified
          ? {
              id: routing.authority.id,
              name: routing.authority.name,
              level: routing.authority.level,
              verified: routing.authority.verified,
              source: routing.authority.source,
              lgdCode: routing.authority.lgdCode,
              localBodyName: routing.authority.localBodyName,
              localBodyType: routing.authority.localBodyType,
              state: routing.authority.state,
              stateCode: routing.authority.stateCode,
              officialPortal: routing.authority.officialPortal,
              submissionMethod: routing.authority.submissionMethod,
            }
          : null,
        localBody: routing.localBody
          ? {
              lgdCode: routing.localBody.lgdCode,
              name: routing.localBody.name,
              type: routing.localBody.type,
              state: routing.localBody.state,
              stateCode: routing.localBody.stateCode,
            }
          : null,
        resolvedLocation,
        officialSubmission: "NOT_CONFIRMED",
      },
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create complaint.",
    });
  }
};

/*
 * =========================================================
 * GET MY COMPLAINTS
 * =========================================================
 */

export const getMyComplaints = async (req, res) => {
  try {
    const userId = Number(req.user?.id);

    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const complaints = await prisma.complaint.findMany({
      where: { userId },
      include: {
        timeline: {
          orderBy: { createdAt: "asc" },
        },
        evidence: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch complaints.",
    });
  }
};

/*
 * =========================================================
 * GET COMPLAINT BY ID
 * =========================================================
 */

export const getComplaintById = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const complaintId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    if (!Number.isInteger(complaintId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await prisma.complaint.findFirst({
      where: {
        id: complaintId,
        userId,
      },
      include: {
        timeline: {
          orderBy: { createdAt: "asc" },
        },
        evidence: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get complaint by ID error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch complaint.",
    });
  }
};

/*
 * =========================================================
 * UPDATE COMPLAINT
 * =========================================================
 */

export const updateComplaint = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const complaintId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    if (!Number.isInteger(complaintId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const existingComplaint = await prisma.complaint.findFirst({
      where: {
        id: complaintId,
        userId,
      },
    });

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const { title, description, priority } = req.body;
    const updateData = {};

    if (title !== undefined && title !== null) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Complaint title cannot be empty.",
        });
      }

      updateData.title = title.trim();
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Complaint description cannot be empty.",
        });
      }

      updateData.description = description.trim();
    }

    if (priority !== undefined && priority !== null) {
      const cleanedPriority = priority.toString().trim().toUpperCase();

      if (!VALID_PRIORITIES.includes(cleanedPriority)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid priority. Allowed values: LOW, MEDIUM, HIGH, CRITICAL.",
        });
      }

      updateData.priority = cleanedPriority;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
      include: {
        timeline: {
          orderBy: { createdAt: "asc" },
        },
        evidence: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update complaint.",
    });
  }
};

/*
 * =========================================================
 * DELETE COMPLAINT
 * =========================================================
 */

export const deleteComplaint = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const complaintId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    if (!Number.isInteger(complaintId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const existingComplaint = await prisma.complaint.findFirst({
      where: {
        id: complaintId,
        userId,
      },
    });

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    await prisma.complaint.delete({
      where: { id: complaintId },
    });

    return res.json({
      success: true,
      message: "Complaint deleted successfully.",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete complaint.",
    });
  }
};

/*
 * =========================================================
 * GET COMPLAINT BY TRACKING NUMBER
 * =========================================================
 */

export const getComplaintByTrackingNumber = async (req, res) => {
  try {
    const userId = Number(req.user?.id ?? req.user?.userId);
    const trackingNumber = req.params.trackingNumber?.trim();

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!trackingNumber || trackingNumber.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid tracking number.",
      });
    }

    const complaint = await prisma.complaint.findFirst({
      where: {
        trackingNumber,
        userId,
      },
      include: {
        timeline: { orderBy: { createdAt: "asc" } },
        evidence: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Tracking lookup error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve complaint.",
    });
  }
};

/*
 * =========================================================
 * UPDATE COMPLAINT STATUS (ADMIN ONLY)
 * =========================================================
 */

export const updateComplaintStatus = async (req, res) => {
  try {
    const userId = Number(req.user?.id ?? req.user?.userId);
    const complaintId = Number(req.params.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only an administrator can update complaint status.",
      });
    }

    if (!Number.isSafeInteger(complaintId) || complaintId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const allowedStatuses = [
      "SUBMITTED",
      "UNDER_REVIEW",
      "IN_PROGRESS",
      "RESOLVED",
      "REJECTED",
    ];

    const { status, message } = req.body;

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status.trim().toUpperCase())
    ) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}.`,
      });
    }

    const nextStatus = status.trim().toUpperCase();

    const timelineMessage =
      typeof message === "string" && message.trim()
        ? message.trim().slice(0, 1000)
        : `Complaint status changed to ${nextStatus}.`;

    const complaint = await prisma.$transaction(async (tx) => {
      const existing = await tx.complaint.findUnique({
        where: { id: complaintId },
      });

      if (!existing) {
        throw new Error("COMPLAINT_NOT_FOUND");
      }

      if (existing.status === nextStatus) {
        throw new Error("STATUS_UNCHANGED");
      }

      await tx.complaint.update({
        where: { id: complaintId },
        data: { status: nextStatus },
      });

      await tx.complaintTimeline.create({
        data: {
          complaintId,
          status: nextStatus,
          message: timelineMessage,
        },
      });

      return tx.complaint.findUnique({
        where: { id: complaintId },
        include: {
          timeline: { orderBy: { createdAt: "asc" } },
          evidence: { orderBy: { createdAt: "asc" } },
        },
      });
    });

    return res.json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint,
    });
  } catch (error) {
    if (error.message === "COMPLAINT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (error.message === "STATUS_UNCHANGED") {
      return res.status(400).json({
        success: false,
        message: "Complaint already has this status.",
      });
    }

    console.error("Update complaint status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status.",
    });
  }
};
