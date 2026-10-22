const categoryRules = [
  {
    category: "EXAMINATION",
    keywords: [
      "neet",
      "neet ug",
      "neet pg",
      "jee",
      "jee mains",
      "jee advanced",
      "upsc exam",
      "ssc exam",
      "exam paper",
      "question paper",
      "paper leak",
      "paper leaked",
      "exam leak",
      "exam cheating",
      "examination",
      "competitive exam",
      "entrance exam",
      "exam result",
      "exam centre",
      "exam center",
    ],
  },

  {
    category: "PASSPORT",
    keywords: [
      "passport",
      "passport seva",
      "passport renewal",
      "passport appointment",
      "passport application",
    ],
  },

  {
    category: "IDENTITY_DOCUMENTS",
    keywords: [
      "aadhaar",
      "aadhar",
      "uidai",
      "pan card",
      "voter id",
      "voter card",
      "epic card",
    ],
  },

  {
    category: "TAXATION",
    keywords: [
      "income tax",
      "income-tax",
      "itr",
      "income tax return",
      "gst",
      "goods and services tax",
      "tax department",
      "tax refund",
      "tax notice",
    ],
  },

  {
    category: "RAILWAYS",
    keywords: [
      "railway",
      "railways",
      "train",
      "railway station",
      "irctc",
      "railway ticket",
      "railway complaint",
    ],
  },

  {
    category: "CYBER_CRIME",
    keywords: [
      "cyber crime",
      "cybercrime",
      "online fraud",
      "online scam",
      "upi fraud",
      "upi scam",
      "phishing",
      "hacked account",
      "cyber fraud",
    ],
  },

  {
    category: "BANKING",
    keywords: [
      "bank",
      "banking",
      "bank account",
      "atm",
      "credit card",
      "debit card",
      "bank transaction",
      "bank fraud",
      "loan",
    ],
  },

  {
    category: "CONSUMER",
    keywords: [
      "consumer complaint",
      "consumer fraud",
      "defective product",
      "defective service",
      "product complaint",
      "seller complaint",
      "ecommerce complaint",
      "online shopping complaint",
    ],
  },

  {
    category: "ELECTRICITY",
    keywords: [
      "electricity",
      "electric",
      "power cut",
      "power outage",
      "transformer",
      "electric pole",
      "electric wire",
      "voltage",
      "electric meter",
      "power supply",
    ],
  },

  {
    category: "WATER",
    keywords: [
      "water supply",
      "water shortage",
      "water leakage",
      "water pipeline",
      "water pipe",
      "drinking water",
      "tap water",
      "water connection",
      "water problem",
    ],
  },

  {
    category: "ROADS",
    keywords: [
      "road",
      "pothole",
      "potholes",
      "footpath",
      "pavement",
      "road damage",
      "broken road",
      "damaged road",
      "road repair",
      "street damage",
    ],
  },

  {
    category: "SANITATION",
    keywords: [
      "garbage",
      "waste",
      "dustbin",
      "solid waste",
      "dirty street",
      "sanitation",
      "drainage",
      "drain",
      "sewage",
      "sewer",
      "waste collection",
      "garbage collection",
      "cleaning",
    ],
  },

  {
    category: "STREET_LIGHT",
    keywords: [
      "street light",
      "streetlight",
      "street lamp",
      "lamp post",
      "light not working",
      "road light",
      "public light",
      "street lights",
    ],
  },

  {
    category: "TRAFFIC",
    keywords: [
      "traffic signal",
      "traffic light",
      "traffic congestion",
      "traffic violation",
      "traffic problem",
      "signal not working",
    ],
  },

  {
    category: "POLICE",
    keywords: [
      "police",
      "theft",
      "crime",
      "robbery",
      "murder",
      "assault",
      "fight",
      "harassment",
      "missing person",
      "law and order",
      "public safety",
    ],
  },

  {
    category: "FIRE_EMERGENCY",
    keywords: [
      "fire",
      "fire brigade",
      "fire emergency",
      "building fire",
      "fire accident",
      "rescue",
    ],
  },

  {
    category: "HEALTH",
    keywords: [
      "hospital",
      "clinic",
      "doctor",
      "medicine",
      "medical",
      "health",
      "ambulance",
      "healthcare",
      "public health",
      "disease",
    ],
  },

  {
    category: "EDUCATION",
    keywords: [
      "school",
      "college",
      "university",
      "education",
      "teacher",
      "student",
      "school infrastructure",
      "education department",
    ],
  },

  {
    category: "PUBLIC_TRANSPORT",
    keywords: [
      "bus",
      "bus service",
      "public transport",
      "public transportation",
      "bus stop",
      "bus route",
      "transport service",
    ],
  },

  {
    category: "ENVIRONMENT",
    keywords: [
      "environment",
      "deforestation",
      "tree cutting",
      "illegal tree cutting",
      "forest",
      "wildlife",
      "environmental damage",
    ],
  },

  {
    category: "POLLUTION",
    keywords: [
      "air pollution",
      "water pollution",
      "noise pollution",
      "pollution",
      "smoke pollution",
      "industrial pollution",
      "chemical pollution",
    ],
  },

  {
    category: "REVENUE_LAND",
    keywords: [
      "land",
      "land record",
      "property record",
      "revenue",
      "mutation",
      "land dispute",
      "land registration",
      "property registration",
      "encroachment",
    ],
  },

  {
    category: "AGRICULTURE",
    keywords: [
      "farmer",
      "farming",
      "agriculture",
      "crop",
      "crop damage",
      "irrigation",
      "fertilizer",
      "pesticide",
      "agricultural subsidy",
    ],
  },

  {
    category: "RURAL_DEVELOPMENT",
    keywords: [
      "gram panchayat",
      "village development",
      "rural development",
      "panchayat",
      "village road",
      "village water",
      "rural scheme",
    ],
  },

  {
    category: "WOMEN_CHILD",
    keywords: [
      "women safety",
      "child safety",
      "child abuse",
      "women welfare",
      "child welfare",
      "domestic violence",
      "child protection",
    ],
  },

  {
    category: "LABOUR",
    keywords: [
      "labour",
      "labor",
      "salary not paid",
      "wages not paid",
      "minimum wage",
      "worker",
      "employment complaint",
      "workplace complaint",
    ],
  },

  {
    category: "SOCIAL_WELFARE",
    keywords: [
      "pension",
      "social welfare",
      "welfare scheme",
      "government benefit",
      "ration",
      "ration card",
      "subsidy",
      "social security",
    ],
  },

  {
    category: "MUNICIPAL_SERVICES",
    keywords: [
      "municipality",
      "municipal corporation",
      "municipal service",
      "public park",
      "park maintenance",
      "local civic service",
      "civic issue",
    ],
  },
];

export function detectCategory(title, description) {
  const text = `${title ?? ""} ${description ?? ""}`
    .toLowerCase()
    .trim();

  for (const rule of categoryRules) {
    if (
      rule.keywords.some((keyword) =>
        text.includes(keyword)
      )
    ) {
      return rule.category;
    }
  }

  return "OTHER";
}