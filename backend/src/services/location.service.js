const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/reverse";

const normalize = (value) =>
  value?.toString().trim() || null;

export const reverseGeocode = async ({
  latitude,
  longitude,
}) => {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      "Valid latitude and longitude are required."
    );
  }

  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid geographic coordinates.");
  }

  const url = new URL(NOMINATIM_URL);

  url.searchParams.set("lat", latitude.toString());
  url.searchParams.set(
    "lon",
    longitude.toString()
  );
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "CivicRouteX/1.0 civic grievance routing project",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Reverse geocoding failed with status ${response.status}.`
    );
  }

  const data = await response.json();

  const address = data.address || {};

  const city =
    normalize(address.city) ||
    normalize(address.town) ||
    normalize(address.municipality) ||
    normalize(address.city_district);

  const district =
    normalize(address.state_district) ||
    normalize(address.district);

  const state = normalize(address.state);

  const country = normalize(address.country);

  return {
    displayName: data.display_name || null,

    latitude,
    longitude,

    locality:
      normalize(address.suburb) ||
      normalize(address.neighbourhood) ||
      normalize(address.village) ||
      normalize(address.hamlet),

    city,
    district,
    state,
    country,

    raw: data,
  };
};