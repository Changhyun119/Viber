import { createHash, randomBytes } from "node:crypto";

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createOpaqueToken(size = 24) {
  return randomBytes(size).toString("hex");
}
