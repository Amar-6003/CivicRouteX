
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

const normalize = (value) =>
  String(value ?? "").trim() || null;

export const reverseGeocode = async ({ latitude, longitude }) => {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Valid geographic coordinates are required.");
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "CivicRouteX/1.0",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data?.address) {
    throw new Error("No address could be resolved for these coordinates.");
  }

  const address = data.address;
  const city =
    normalize(address.city) ||
    normalize(address.town) ||
    normalize(address.municipality) ||
    normalize(address.village) ||
    normalize(address.city_district);

  return {
    displayName: data.display_name || null,
    latitude,
    longitude,
    locality:
      normalize(address.suburb) ||
      normalize(address.neighbourhood) ||
      normalize(address.hamlet),
    city,
    district:
      normalize(address.state_district) ||
      normalize(address.district),
    state: normalize(address.state),
    country: normalize(address.country),
  };
};
