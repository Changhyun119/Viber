import { sql } from "../src/db";
import { cleanupExpiredPendingProjects } from "../src/lib/services/maintenance";

async function main() {
  const result = await cleanupExpiredPendingProjects();
  console.log(`expired pending projects deleted=${result.deletedProjects}`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
