/**
 * A basic PII (Personally Identifiable Information) scrubber for demo purposes.
 * Real-world applications should use libraries like Microsoft Presidio (Python)
 * or dedicated enterprise PII scrubbing services.
 */

export interface ScrubberResult {
  scrubbedText: string;
  detectedCount: number;
}

const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  names: /\b(Patient|Name|Provider|Dr\.)\s*:\s*[A-Z][a-z]+(\s+[A-Z][a-z]+)*\b|\b[A-Z]{2,}\s+[A-Z]{2,}\b|\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  address: /\d+\s+[A-Za-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Circle|Cir|Trail|Trl|Way)\b/gi,
};

export function scrubText(text: string): ScrubberResult {
  let scrubbed = text;
  let count = 0;

  for (const [key, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      count += matches.length;
      scrubbed = scrubbed.replace(pattern, `[${key.toUpperCase()}]`);
    }
  }

  return {
    scrubbedText: scrubbed,
    detectedCount: count,
  };
}
