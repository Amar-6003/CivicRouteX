import "dotenv/config";
import prisma from "../config/prisma.js";

const LGD_API_KEY = process.env.LGD_API_KEY;
const LGD_API_URL = process.env.LGD_API_URL;

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const fetchLGD = async ({ state, limit = 100, offset = 0 }) => {
  if (!LGD_API_KEY || !LGD_API_URL) {
    throw new Error("LGD API configuration is missing.");
  }

  const url = new URL(LGD_API_URL);
  url.searchParams.set("api-key", LGD_API_KEY);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));

  if (state) {
    url.searchParams.set("filters[stateNameEnglish]", state);
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30000),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `LGD API returned ${response.status}: ${body.slice(0, 300)}`,
    );
  }

  let data;

  try {
    data = JSON.parse(body);
  } catch {
    throw new Error("LGD API returned invalid JSON.");
  }

  if (data.status !== "ok" || !Array.isArray(data.records)) {
    throw new Error("Unexpected LGD API response.");
  }

  return data;
};

const mapRecord = (record) => {
  const lgdCode = parseOptionalInt(record.localBodyCode);
  const stateCode = parseOptionalInt(record.stateCode);

  if (!lgdCode || !stateCode) return null;

  const name = String(record.localBodyNameEnglish ?? "").trim();
  const stateName = String(record.stateNameEnglish ?? "").trim();

  if (!name || !stateName) return null;

  return {
    lgdCode,
    stateCode,
    stateName,
    name,
    typeCode:
      record.localBodyTypeCode == null
        ? null
        : String(record.localBodyTypeCode),
    typeName: String(record.localBodyTypeName ?? "").trim() || null,
    entityCode: parseOptionalInt(record.entityCode),
    entityName: String(record.entityName ?? "").trim() || null,
    entityType: String(record.entityType ?? "").trim() || null,
    coverageType: String(record.coverageType ?? "").trim() || null,
    lastUpdated: parseDate(record.date_updated),
  };
};

/*
 * Import a single API batch.
 *
 * createMany + skipDuplicates makes repeated batches safe.
 * Existing records are preserved; new records are inserted.
 */
export const syncLGDBatch = async ({ state, limit = 100, offset = 0 }) => {
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
    throw new Error("Batch limit must be between 1 and 1000.");
  }

  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error("Offset must be a non-negative integer.");
  }

  const data = await fetchLGD({ state, limit, offset });
  const rows = data.records.map(mapRecord).filter(Boolean);

  const result = rows.length
    ? await prisma.lGDLocalBody.createMany({
        data: rows,
        skipDuplicates: true,
      })
    : { count: 0 };

  return {
    fetched: data.records.length,
    valid: rows.length,
    inserted: result.count,
    total: Number(data.total || 0),
    nextOffset: offset + data.records.length,
    hasMore: offset + data.records.length < Number(data.total || 0),
  };
};

/*
 * Database-backed directory pagination.
 */
export const listLocalBodies = async ({
  page = 1,
  limit = 20,
  search = "",
  state = "",
  type = "",
}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

  const filters = {
    ...(state.trim()
      ? {
          stateName: {
            contains: state.trim(),
            mode: "insensitive",
          },
        }
      : {}),
    ...(type.trim()
      ? {
          typeName: {
            contains: type.trim(),
            mode: "insensitive",
          },
        }
      : {}),
    ...(search.trim()
      ? {
          OR: [
            { name: { contains: search.trim(), mode: "insensitive" } },
            { stateName: { contains: search.trim(), mode: "insensitive" } },
            { entityName: { contains: search.trim(), mode: "insensitive" } },
            { typeName: { contains: search.trim(), mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [localBodies, total] = await Promise.all([
    prisma.lGDLocalBody.findMany({
      where: filters,
      orderBy: [{ stateName: "asc" }, { name: "asc" }, { lgdCode: "asc" }],
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    }),

    prisma.lGDLocalBody.count({
      where: filters,
    }),
  ]);

  return {
    localBodies,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

/*
 * Conservative matching:
 * do not pick an arbitrary body when multiple records match.
 *
 * Note: LGDLocalBody has no district column, so district-level
 * verification cannot be guaranteed from this schema alone.
 */

export const findLocalBody = async ({ state, district, city }) => {
  if (!state?.trim() || !city?.trim()) return null;

  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[.,()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const normalizedState = normalize(state);
  const normalizedCity = normalize(city);

  const matches = await prisma.lGDLocalBody.findMany({
    where: {
      stateName: {
        equals: state.trim(),
        mode: "insensitive",
      },
      OR: [
        {
          name: {
            equals: city.trim(),
            mode: "insensitive",
          },
        },
        {
          entityName: {
            equals: city.trim(),
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { lgdCode: "asc" },
    take: 3,
  });

  const exactMatches = matches.filter(
    (record) =>
      normalize(record.stateName) === normalizedState &&
      (normalize(record.name) === normalizedCity ||
        normalize(record.entityName) === normalizedCity),
  );

  // Do not pick an arbitrary local body if the result is ambiguous.
  if (exactMatches.length !== 1) return null;

  const selected = exactMatches[0];

  return {
    lgdCode: selected.lgdCode,
    name: selected.name,
    type: selected.typeName,
    state: selected.stateName,
    stateCode: selected.stateCode,
    entityCode: selected.entityCode,
    entityName: selected.entityName,
    entityType: selected.entityType,
    coverageType: selected.coverageType,
    district: district ?? null,
  };
};
