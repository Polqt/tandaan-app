type FirestoreTimestamp = {
  toDate: () => Date;
};

export function toIsoTimestamp(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "toDate" in value) {
    return (value as FirestoreTimestamp).toDate().toISOString();
  }

  return new Date(0).toISOString();
}

export function toIsoTimestampOrNull(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const result = toIsoTimestamp(value);
  // Return null if it resolved to epoch (i.e. unrecognized input)
  return result === new Date(0).toISOString() ? null : result;
}
