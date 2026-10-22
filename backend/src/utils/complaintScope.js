const centralKeywords = [
  "neet",
  "neet ug",
  "neet pg",
  "jee mains",
  "jee advanced",
  "upsc",
  "ssc exam",
  "national examination",
  "central government",
  "central ministry",
  "union government",
  "aadhaar",
  "aadhar",
  "uidai",
  "pan card",
  "income tax",
  "gst",
  "passport",
  "passport seva",
  "railway",
  "railways",
  "irctc",
  "central scheme",
  "national scheme",
];

const stateKeywords = [
  "state government",
  "state department",
  "state electricity",
  "state electricity board",
  "state transport",
  "state education department",
  "state health department",
  "state police",
  "state scheme",
];

const localKeywords = [
  "my area",
  "my locality",
  "my neighborhood",
  "my neighbourhood",
  "near my house",
  "near my home",
  "my street",
  "local road",
  "local area",
  "municipal",
  "municipality",
  "municipal corporation",
  "gram panchayat",
  "village road",
  "street light",
  "streetlight",
  "garbage",
  "pothole",
  "potholes",
  "drainage",
  "local water",
];

const includesAny = (text, keywords) =>
  keywords.some((keyword) => text.includes(keyword));

export function detectGovernmentLevel(
  title,
  description,
  category
) {
  const text = `${title ?? ""} ${description ?? ""}`
    .toLowerCase()
    .trim();

  /*
   * CENTRAL
   *
   * Semantic signals first.
   * Location must NOT override this.
   */

  if (includesAny(text, centralKeywords)) {
    return "CENTRAL";
  }

  const centralCategories = [
    "EXAMINATION",
    "PASSPORT",
    "IDENTITY_DOCUMENTS",
    "TAXATION",
    "RAILWAYS",
  ];

  if (centralCategories.includes(category)) {
    return "CENTRAL";
  }

  /*
   * STATE
   */

  if (includesAny(text, stateKeywords)) {
    return "STATE";
  }

  /*
   * LOCAL
   */

  if (includesAny(text, localKeywords)) {
    return "LOCAL";
  }

  const localCategories = [
    "ROADS",
    "WATER",
    "SANITATION",
    "STREET_LIGHT",
    "MUNICIPAL_SERVICES",
  ];

  if (localCategories.includes(category)) {
    return "LOCAL";
  }

  /*
   * Normally state-level categories.
   */

  const stateCategories = [
    "ELECTRICITY",
    "PUBLIC_TRANSPORT",
    "TRAFFIC",
    "POLICE",
    "HEALTH",
    "EDUCATION",
    "ENVIRONMENT",
    "POLLUTION",
    "REVENUE_LAND",
    "AGRICULTURE",
    "RURAL_DEVELOPMENT",
    "WOMEN_CHILD",
    "LABOUR",
    "SOCIAL_WELFARE",
    "CYBER_CRIME",
    "BANKING",
    "CONSUMER",
  ];

  if (stateCategories.includes(category)) {
    return "STATE";
  }

  return "UNKNOWN";
}