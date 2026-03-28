import { loadLocalEnv } from "../tests/e2e/load-env";

loadLocalEnv();

function maskCredentials(urlString: string) {
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    const port = url.port || "(default)";
    const database = url.pathname.replace(/^\//, "") || "(unknown)";
    const isLocal = ["127.0.0.1", "localhost"].includes(host);

    return {
      host,
      port,
      database,
      isLocal
    };
  } catch {
    return null;
  }
}

async function main() {
  const value = process.env.DATABASE_URL;

  if (!value) {
    throw new Error("DATABASE_URL 이 설정되지 않았습니다.");
  }

  const parsed = maskCredentials(value);

  if (!parsed) {
    throw new Error("DATABASE_URL 형식을 해석하지 못했습니다.");
  }

  console.log(
    JSON.stringify(
      {
        host: parsed.host,
        port: parsed.port,
        database: parsed.database,
        scope: parsed.isLocal ? "local" : "remote"
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
