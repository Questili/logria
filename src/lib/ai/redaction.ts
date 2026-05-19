const secretPatterns = [
  /sk_(live|test)_[A-Za-z0-9]+/g,
  /(?:api[_-]?key|token|secret)\s*[:=]\s*['"]?[^\s,'"]+/gi,
  /Bearer\s+[A-Za-z0-9._-]+/g,
  /\b(?:\d[ -]*?){13,19}\b/g,
];

export function redactText(input: string): string {
  return secretPatterns.reduce((text, pattern) => text.replace(pattern, "[REDACTED]"), input);
}

export function sanitizeExternalText(input: string): string {
  return redactText(input).replace(/ignore (all|previous|the above) instructions/gi, "[untrusted instruction removed]");
}

export function redactObject<T>(value: T): T {
  return JSON.parse(redactText(JSON.stringify(value))) as T;
}
