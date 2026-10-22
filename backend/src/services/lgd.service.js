import "dotenv/config";
import prisma from "../config/prisma.js";

const LGD_API_KEY = process.env.LGD_API_KEY;
const LGD_API_URL = process.env.LGD_API_URL;

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const parseOptionalInt = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

/*
 * =========================================================
 * FETCH LGD
 * =========================================================
 */

const fetchLGD = async ({
  state,
  limit = 100,
  offset = 0,
}) => {
  if (!LGD_API_KEY) {
    throw new Error("LGD_API_KEY is not configured");
  }

  if (!LGD_API_URL) {
    throw new Error("LGD_API_URL is not configured");
  }

  const url = new URL(LGD_API_URL);

  url.searchParams.set("api-key", LGD_API_KEY);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));

  if (state) {
    url.searchParams.set(
      "filters[stateNameEnglish]",
      state
    );
  }

  const response = await fetch(url);

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `LGD API failed with ${response.status}: ${text.slice(
        0,
        500
      )}`
    );
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("LGD API returned invalid JSON");
  }

  if (data.status !== "ok") {
    throw new Error(
      "LGD API returned an unsuccessful response"
    );
  }

  return data;
};

/*
 * =========================================================
 * SYNC ONE BATCH
 * =========================================================
 */

export const syncLGDBatch = async ({
  state,
  limit = 100,
  offset = 0,
}) => {
  const data = await fetchLGD({
    state,
    limit,
    offset,
  });

  const records = Array.isArray(data.records)
    ? data.records
    : [];

  let synced = 0;

  for (const record of records) {
    const lgdCode = parseOptionalInt(
      record.localBodyCode
    );

    const stateCode = parseOptionalInt(
      record.stateCode
    );

    if (!lgdCode || !stateCode) {
      continue;
    }

    await prisma.lGDLocalBody.upsert({
      where: {
        lgdCode,
      },

      update: {
        stateCode,
        stateName:
          record.stateNameEnglish?.trim() || "",

        name:
          record.localBodyNameEnglish?.trim() || "",

        typeCode:
          record.localBodyTypeCode !== undefined &&
          record.localBodyTypeCode !== null
            ? String(record.localBodyTypeCode)
            : null,

        typeName:
          record.localBodyTypeName?.trim() || null,

        entityCode: parseOptionalInt(
          record.entityCode
        ),

        entityName:
          record.entityName?.trim() || null,

        entityType:
          record.entityType?.trim() || null,

        coverageType:
          record.coverageType?.trim() || null,

        lastUpdated: parseDate(
          record.date_updated
        ),
      },

      create: {
        lgdCode,
        stateCode,

        stateName:
          record.stateNameEnglish?.trim() || "",

        name:
          record.localBodyNameEnglish?.trim() || "",

        typeCode:
          record.localBodyTypeCode !== undefined &&
          record.localBodyTypeCode !== null
            ? String(record.localBodyTypeCode)
            : null,

        typeName:
          record.localBodyTypeName?.trim() || null,

        entityCode: parseOptionalInt(
          record.entityCode
        ),

        entityName:
          record.entityName?.trim() || null,

        entityType:
          record.entityType?.trim() || null,

        coverageType:
          record.coverageType?.trim() || null,

        lastUpdated: parseDate(
          record.date_updated
        ),
      },
    });

    synced++;
  }

  return {
    fetched: records.length,
    synced,
    total: Number(data.total || 0),
  };
};

/*
 * =========================================================
 * FIND LOCAL BODY
 * =========================================================
 */

export const findLocalBody = async ({
  state,
  district,
  city,
}) => {
  const normalizedState =
    state?.toString().trim();

  const normalizedDistrict =
    district?.toString().trim();

  const normalizedCity =
    city?.toString().trim();

  if (!normalizedState || !normalizedCity) {
    return null;
  }

  /*
   * IMPORTANT:
   *
   * Never use contains(), startsWith(), or fuzzy
   * matching for jurisdiction.
   *
   * Wrong jurisdiction is worse than UNVERIFIED.
   */

  const matches =
    await prisma.lGDLocalBody.findMany({
      where: {
        stateName: {
          equals: normalizedState,
          mode: "insensitive",
        },

        name: {
          equals: normalizedCity,
          mode: "insensitive",
        },
      },

      orderBy: {
        typeCode: "asc",
      },

      take: 50,
    });

  if (matches.length === 0) {
    return null;
  }

  /*
   * Prefer actual local-government records.
   */

  const preferredTypes = [
    "Municipal Corporations",
    "Municipality",
    "Municipal Corporation",
    "Nagar Panchayat",
    "Town Panchayat",
    "Village Panchayat",
    "Gram Panchayat",
  ];

  const preferred =
    matches.find((row) =>
      preferredTypes.some(
        (type) =>
          row.typeName?.toLowerCase() ===
          type.toLowerCase()
      )
    );

  const selected =
    preferred || matches[0];

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
  };
};