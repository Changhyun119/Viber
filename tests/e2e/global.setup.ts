import { execSync } from "node:child_process";

const workspaceDir = process.cwd();
const sharedEnv = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:54329/vibe_showcase",
  NEXT_PUBLIC_APP_URL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100",
  NEXT_PUBLIC_ENABLE_DEV_AUTH: process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH ?? "true",
  DEV_ADMIN_EMAIL: process.env.DEV_ADMIN_EMAIL ?? "admin@local.test",
  DEV_MEMBER_EMAIL: process.env.DEV_MEMBER_EMAIL ?? "member@local.test"
};

function run(command: string) {
  execSync(command, {
    cwd: workspaceDir,
    env: sharedEnv,
    stdio: "inherit"
  });
}

function getHealthStatus() {
  try {
    return execSync("docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}' vibe-showcase-postgres", {
      cwd: workspaceDir,
      env: sharedEnv,
      encoding: "utf8"
    }).trim();
  } catch {
    return "missing";
  }
}

async function waitForPostgres() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const status = getHealthStatus();

    if (status === "healthy") {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error("Postgres 컨테이너가 healthy 상태가 되지 않았습니다.");
}

async function globalSetup() {
  run("docker compose up -d postgres");
  await waitForPostgres();
  run("npm run db:migrate");
  run("npm run db:seed");
}

export default globalSetup;
