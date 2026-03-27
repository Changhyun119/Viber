import { env } from "@/lib/env";
import { ensureAbsoluteUrl } from "@/lib/utils/urls";

export function buildRedirectPath(basePath: string | null | undefined, params?: Record<string, string | undefined | null>) {
  const url = new URL(ensureAbsoluteUrl(basePath || "/"), env.NEXT_PUBLIC_APP_URL);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (!value) continue;
    url.searchParams.set(key, value);
  }

  return url.toString();
}

export function parseOptionalString(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function parseRequiredString(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export function parseCheckbox(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string") return false;
  return ["on", "true", "1", "yes"].includes(value.toLowerCase());
}

export function parseCsvList(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function countLinks(value: string) {
  return (value.match(/https?:\/\/[^\s)]+/g) ?? []).length;
}
