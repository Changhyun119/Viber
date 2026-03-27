import { eq } from "drizzle-orm";

import { db, sql } from "../src/db";
import { profiles } from "../src/db/schema";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    throw new Error("사용법: npm run auth:promote-admin -- <email>");
  }

  const existing = await db.query.profiles.findFirst({
    where: eq(profiles.email, email)
  });

  if (!existing) {
    throw new Error(`'${email}' 사용자 프로필이 없습니다. 먼저 해당 이메일로 로그인해 프로필을 생성해 주세요.`);
  }

  if (existing.role === "admin") {
    console.log(`'${email}' 은(는) 이미 관리자입니다.`);
    await sql.end();
    return;
  }

  await db
    .update(profiles)
    .set({
      role: "admin",
      updatedAt: new Date()
    })
    .where(eq(profiles.email, email));

  console.log(`'${email}' 을(를) 관리자로 승격했습니다.`);
  await sql.end();
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await sql.end();
  process.exit(1);
});
