import prisma from "../config/prisma.js";

import {
  findLocalBody,
} from "./lgd.service.js";

import {
  reverseGeocode,
} from "./location.service.js";

import {
  buildLocalAuthority,
} from "./localAuthority.service.js";

const normalize = (value) =>
  value?.toString().trim().toLowerCase() || "";

/*
 * =========================================================
 * LOCATION RESOLUTION
 * =========================================================
 */

const resolveLocation = async ({
  state,
  district,
  city,
  latitude,
  longitude,
}) => {
  let resolvedLocation = null;

  /*
   * GPS is the strongest location signal.
   */

  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    try {
      resolvedLocation =
        await reverseGeocode({
          latitude,
          longitude,
        });
    } catch (error) {
      console.error(
        "Reverse geocoding failed:",
        error.message
      );
    }
  }

  return {
    resolvedLocation,

    state:
      resolvedLocation?.state ||
      state ||
      null,

    district:
      resolvedLocation?.district ||
      district ||
      null,

    city:
      resolvedLocation?.city ||
      city ||
      null,
  };
};

/*
 * =========================================================
 * ROUTE COMPLAINT
 * =========================================================
 */

export const routeComplaint = async ({
  category,
  governmentLevel,

  state,
  district,
  city,

  latitude,
  longitude,
}) => {
  const location =
    await resolveLocation({
      state,
      district,
      city,
      latitude,
      longitude,
    });

  const resolvedLocation =
    location.resolvedLocation;

  const resolvedState =
    location.state;

  const resolvedDistrict =
    location.district;

  const resolvedCity =
    location.city;

  /*
   * =======================================================
   * LOCAL
   * =======================================================
   */

  if (
    governmentLevel === "LOCAL"
  ) {
    const localBody =
      await findLocalBody({
        state: resolvedState,
        district: resolvedDistrict,
        city: resolvedCity,
      });

    if (!localBody) {
      return {
        routingStatus: "UNVERIFIED",

        authority: null,

        localBody: null,

        resolvedLocation,

        reason:
          "No exact LGD local body could be verified for the supplied location.",
      };
    }

    /*
     * Build authority directly from LGD.
     *
     * NO AuthorityRegistry.
     * NO hardcoded corporation names.
     */

    const authority =
      buildLocalAuthority(
        localBody
      );

    if (!authority) {
      return {
        routingStatus: "UNVERIFIED",

        authority: null,

        localBody,

        resolvedLocation,

        reason:
          "LGD local body was found, but a local authority could not be constructed from the verified LGD record.",
      };
    }

    return {
      routingStatus: "ROUTED",

      authority,

      localBody,

      resolvedLocation,

      reason:
        "Complaint matched a local government jurisdiction directly from the verified LGD local-body directory.",
    };
  }

  /*
   * =======================================================
   * CENTRAL
   * =======================================================
   *
   * LOCAL authority registry is no longer used.
   *
   * Central routing remains classification-based for now.
   */

  if (
    governmentLevel === "CENTRAL"
  ) {
    return {
      routingStatus: "UNVERIFIED",

      authority: null,

      localBody: null,

      resolvedLocation,

      reason:
        "Complaint was classified as CENTRAL, but no verified central authority submission endpoint is configured yet.",
    };
  }

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  if (
    governmentLevel === "STATE"
  ) {
    return {
      routingStatus: "UNVERIFIED",

      authority: null,

      localBody: null,

      resolvedLocation,

      reason:
        "Complaint was classified as STATE, but no verified state authority submission endpoint is configured yet.",
    };
  }

  /*
   * =======================================================
   * UNKNOWN
   * =======================================================
   */

  return {
    routingStatus: "UNVERIFIED",

    authority: null,

    localBody: null,

    resolvedLocation,

    reason:
      "Government level could not be determined with sufficient confidence.",
  };
};