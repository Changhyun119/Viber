import { categoryOptions, platformOptions, pricingOptions, stageOptions } from "@/lib/constants";
import { getCurrentProfile } from "@/lib/auth/session";
import { SubmitPageClient } from "./submit-client";

export default async function SubmitPage() {
  const viewer = await getCurrentProfile();
  const verificationMethod = viewer?.githubUsername ? "github" : "email";

  return (
    <SubmitPageClient
      viewer={viewer ? { displayName: viewer.displayName, githubUsername: viewer.githubUsername ?? null } : null}
      verificationMethod={verificationMethod}
      categoryOptions={categoryOptions}
      platformOptions={platformOptions}
      pricingOptions={pricingOptions}
      stageOptions={stageOptions}
    />
  );
}
