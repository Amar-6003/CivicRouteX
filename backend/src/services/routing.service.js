
import { findLocalBody } from "./lgd.service.js";
import { reverseGeocode } from "./location.service.js";
import { buildLocalAuthority } from "./localAuthority.service.js";

const normalize = (value) =>
  String(value ?? "").normalize("NFKC").trim();

const same = (a, b) =>
  normalize(a).toLowerCase() === normalize(b).toLowerCase();

const unverified = (reason, resolvedLocation = null, localBody = null) => ({
  routingStatus: "UNVERIFIED",
  authority: null,
  localBody,
  resolvedLocation,
  reason,
  officialSubmission: "NOT_CONFIRMED",
});

const resolveLocation = async ({
  state,
  district,
  city,
  latitude,
  longitude,
}) => {
  let resolvedLocation = null;

  if (latitude != null && longitude != null) {
    try {
      resolvedLocation = await reverseGeocode({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    } catch (error) {
      console.error("Reverse geocoding failed:", error.message);
    }
  }

  // Never use manually entered Indian location to override GPS
  // that explicitly resolved to a different country.
  if (
    resolvedLocation?.country &&
    !same(resolvedLocation.country, "India")
  ) {
    return {
      resolvedLocation,
      state: null,
      district: null,
      city: null,
      invalidCountry: true,
    };
  }

  return {
    resolvedLocation,
    state: resolvedLocation?.state || state || null,
    district: resolvedLocation?.district || district || null,
    city: resolvedLocation?.city || city || null,
    invalidCountry: false,
  };
};

const findRegisteredAuthority = async ({ category, governmentLevel, state }) => {
  // Dynamically import Prisma here to keep the local-body lookup
  // separate from the optional verified authority registry.
  const { default: prisma } = await import("../config/prisma.js");

  if (governmentLevel === "STATE" && !state) return null;

  const records = await prisma.authority.findMany({
    where: {
      isActive: true,
      verified: true,
      level: governmentLevel,
      officialPortal: { not: null },
      ...(governmentLevel === "STATE"
        ? { state: { equals: state, mode: "insensitive" } }
        : {}),
      ...(category
        ? { category: { equals: category, mode: "insensitive" } }
        : {}),
    },
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
    take: 2,
  });

  // Ambiguous registry matches must not silently choose the first.
  return records.length === 1 ? records[0] : null;
};

export const routeComplaint = async ({
  category,
  governmentLevel,
  state,
  district,
  city,
  latitude,
  longitude,
}) => {
  const location = await resolveLocation({
    state,
    district,
    city,
    latitude,
    longitude,
  });

  const resolvedLocation = location.resolvedLocation;

  if (location.invalidCountry) {
    return unverified(
      "The supplied coordinates resolve outside India. Check the complaint location.",
      resolvedLocation
    );
  }

  const resolvedState = location.state;
  const resolvedDistrict = location.district;
  const resolvedCity = location.city;

  if (governmentLevel === "LOCAL") {
    if (!resolvedState || !resolvedCity) {
      return unverified(
        "State and city/local-body information are required to verify local jurisdiction.",
        resolvedLocation
      );
    }

    const localBody = await findLocalBody({
      state: resolvedState,
      district: resolvedDistrict,
      city: resolvedCity,
    });

    if (!localBody) {
      return unverified(
        "No unique local body could be verified from the available LGD records. Check the location details.",
        resolvedLocation
      );
    }

    const authority = buildLocalAuthority(localBody);

    if (!authority) {
      return unverified(
        "A local-body record was found, but a reliable authority record could not be constructed.",
        resolvedLocation,
        localBody
      );
    }

    return {
      routingStatus: "ROUTED",
      authority,
      localBody,
      resolvedLocation,
      reason: authority.officialPortalVerified
        ? "Local jurisdiction matched an LGD record and a configured official authority portal is available. Filing is not confirmed."
        : "Local jurisdiction matched an LGD record, but no configured official portal was matched. The citizen must confirm the correct submission channel.",
      officialSubmission: "NOT_CONFIRMED",
    };
  }

  if (governmentLevel === "STATE" || governmentLevel === "CENTRAL") {
    const authority = await findRegisteredAuthority({
      category,
      governmentLevel,
      state: resolvedState,
    });

    if (!authority) {
      return unverified(
        `No unique verified ${governmentLevel.toLowerCase()} authority record with an official portal is configured for this category and location.`,
        resolvedLocation
      );
    }

    return {
      routingStatus: "ROUTED",
      authority: {
        ...authority,
        jurisdictionVerified: true,
        officialPortalVerified: true,
      },
      localBody: null,
      resolvedLocation,
      reason: "Matched a unique active, verified authority registry record with an official portal. Filing is not confirmed.",
      officialSubmission: "NOT_CONFIRMED",
    };
  }

  return unverified(
    "Government level could not be determined confidently. Review the complaint category and location.",
    resolvedLocation
  );
};
