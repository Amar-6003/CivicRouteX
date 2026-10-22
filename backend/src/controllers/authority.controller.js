
import prisma from "../config/prisma.js";

export const getAuthorities = async (req, res) => {
  try {
    const {
      search = "",
      state = "",
      category = "",
      page = "1",
      limit = "20",
    } = req.query;

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, Number.parseInt(limit, 10) || 20)
    );

    const filters = {
      isActive: true,
      ...(state.trim()
        ? { state: { contains: state.trim(), mode: "insensitive" } }
        : {}),
      ...(category.trim()
        ? { category: { contains: category.trim(), mode: "insensitive" } }
        : {}),
      ...(search.trim()
        ? {
            OR: [
              { name: { contains: search.trim(), mode: "insensitive" } },
              { category: { contains: search.trim(), mode: "insensitive" } },
              { state: { contains: search.trim(), mode: "insensitive" } },
              { district: { contains: search.trim(), mode: "insensitive" } },
              { city: { contains: search.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [authorities, total] = await prisma.$transaction([
      prisma.authority.findMany({
        where: filters,
        select: {
          id: true,
          name: true,
          category: true,
          level: true,
          country: true,
          state: true,
          district: true,
          city: true,
          jurisdictionType: true,
          officialPortal: true,
          submissionMethod: true,
          officialContact: true,
          source: true,
          verified: true,
        },
        orderBy: [{ verified: "desc" }, { name: "asc" }],
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      prisma.authority.count({ where: filters }),
    ]);

    return res.json({
      success: true,
      authorities,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get authorities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch authorities.",
    });
  }
};
