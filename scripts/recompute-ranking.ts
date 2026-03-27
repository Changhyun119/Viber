import { sql } from "../src/db";
import { recomputeProjectRankSnapshots } from "../src/lib/services/maintenance";

async function main() {
  const result = await recomputeProjectRankSnapshots();
  console.log(`ranking snapshots inserted=${result.inserted}`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
