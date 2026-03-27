import { sql } from "../src/db";
import { runLinkHealthChecks } from "../src/lib/services/maintenance";

async function main() {
  const result = await runLinkHealthChecks();
  console.log(
    `link health checked=${result.checked} healthy=${result.healthy} degraded=${result.degraded} broken=${result.broken}`
  );
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
