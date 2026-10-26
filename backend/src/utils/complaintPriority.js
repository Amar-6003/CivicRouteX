
const criticalPatterns = [
  /\b(life threatening|life-threatening|immediate danger)\b/i,
  /\b(active fire|live electric wire|electrocution risk)\b/i,
  /\b(severe injury|person trapped|unconscious)\b/i,
];

const highPatterns = [
  /\b(sewage overflow|contaminated drinking water)\b/i,
  /\b(serious health hazard|dangerous pothole)\b/i,
  /\b(garbage causing illness|waste blocking emergency access)\b/i,
];

const lowPatterns = [
  /\b(minor inconvenience|cosmetic damage|non urgent|non-urgent)\b/i,
];

export function detectPriority(title, description) {
  const text = `${title ?? ""} ${description ?? ""}`.trim();

  if (criticalPatterns.some((pattern) => pattern.test(text))) {
    return "CRITICAL";
  }

  if (highPatterns.some((pattern) => pattern.test(text))) {
    return "HIGH";
  }

  if (lowPatterns.some((pattern) => pattern.test(text))) {
    return "LOW";
  }

  return "MEDIUM";
}
