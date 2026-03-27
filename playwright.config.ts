import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const sharedEnv = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:54329/vibe_showcase",
  NEXT_PUBLIC_APP_URL: baseURL,
  NEXT_PUBLIC_ENABLE_DEV_AUTH: process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH ?? "true",
  DEV_ADMIN_EMAIL: process.env.DEV_ADMIN_EMAIL ?? "admin@local.test",
  DEV_MEMBER_EMAIL: process.env.DEV_MEMBER_EMAIL ?? "member@local.test"
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  globalSetup: "./tests/e2e/global.setup.ts",
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ],
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    cwd: process.cwd(),
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: false,
    env: sharedEnv
  }
});
