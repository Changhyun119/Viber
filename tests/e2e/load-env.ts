import fs from "node:fs";
import path from "node:path";

let loaded = false;

function normalizeValue(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function loadLocalEnv() {
  if (loaded) {
    return;
  }

  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    loaded = true;
    return;
  }

  const source = fs.readFileSync(envPath, "utf8");

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();

    if (!key || process.env[key]) {
      continue;
    }

    const value = normalizeValue(trimmed.slice(separatorIndex + 1));
    process.env[key] = value;
  }

  loaded = true;
}
