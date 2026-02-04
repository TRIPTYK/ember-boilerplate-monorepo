import { createHash, randomBytes } from "crypto";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateFamilyId(): string {
  return randomBytes(16).toString("hex");
}
