export type RangeFlag = "normal" | "low" | "high" | "abnormal";

export function evaluateResultFlag(valueStr: string, referenceRange: string): RangeFlag {
  const numericVal = parseFloat(valueStr);
  if (isNaN(numericVal)) return "normal"; // Default for non-numeric/text observations

  const range = referenceRange.trim();

  // Pattern: "70 - 110" or "70-110"
  const rangeMatch = range.match(/^([\d.]+)\s*-\s*([\d.]+)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (numericVal < min) return "low";
    if (numericVal > max) return "high";
    return "normal";
  }

  // Pattern: "< 200" or "<= 200"
  const lessMatch = range.match(/^<=\?\s*([\d.]+)$/);
  if (lessMatch) {
    const max = parseFloat(lessMatch[1]);
    return numericVal > max ? "high" : "normal";
  }

  // Pattern: "> 60" or ">= 60"
  const greaterMatch = range.match(/^>=\?\s*([\d.]+)$/);
  if (greaterMatch) {
    const min = parseFloat(greaterMatch[1]);
    return numericVal < min ? "low" : "normal";
  }

  return "normal";
}