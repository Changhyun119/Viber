import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/session";
import { buildRedirectPath, parseCheckbox, parseRequiredString } from "@/lib/http";
import { submitLaunchProject } from "@/lib/services/mutations";
import { launchSubmissionSchema } from "@/lib/validations/forms";

export async function POST(request: Request) {
  const viewer = await getCurrentProfile();
  const formData = await request.formData();

  try {
    const parsed = launchSubmissionSchema.parse({
      kind: "launch",
      title: parseRequiredString(formData.get("title")),
      tagline: parseRequiredString(formData.get("tagline")),
      shortDescription: parseRequiredString(formData.get("shortDescription")),
      overviewMd: parseRequiredString(formData.get("overviewMd")),
      problemMd: parseRequiredString(formData.get("problemMd")),
      targetUsersMd: parseRequiredString(formData.get("targetUsersMd")),
      whyMadeMd: parseRequiredString(formData.get("whyMadeMd")),
      stage: parseRequiredString(formData.get("stage")),
      category: parseRequiredString(formData.get("category")),
      platform: parseRequiredString(formData.get("platform")),
      pricingModel: parseRequiredString(formData.get("pricingModel")),
      pricingNote: parseRequiredString(formData.get("pricingNote")),
      liveUrl: parseRequiredString(formData.get("liveUrl")),
      githubUrl: parseRequiredString(formData.get("githubUrl")),
      demoUrl: parseRequiredString(formData.get("demoUrl")),
      docsUrl: parseRequiredString(formData.get("docsUrl")),
      makerAlias: parseRequiredString(formData.get("makerAlias")),
      coverImageUrl: parseRequiredString(formData.get("coverImageUrl")),
      galleryCsv: parseRequiredString(formData.get("galleryCsv")),
      aiToolsCsv: parseRequiredString(formData.get("aiToolsCsv")),
      tagCsv: parseRequiredString(formData.get("tagCsv")),
      ownerEmail: parseRequiredString(formData.get("ownerEmail")),
      verificationMethod: parseRequiredString(formData.get("verificationMethod")),
      isOpenSource: parseCheckbox(formData.get("isOpenSource")),
      noSignupRequired: parseCheckbox(formData.get("noSignupRequired")),
      isSoloMaker: parseCheckbox(formData.get("isSoloMaker"))
    });

    const result = await submitLaunchProject({
      ...parsed,
      viewer
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/submit");

    const targetPath = result.claimToken ? `/claim/${result.claimToken}` : "/me/projects";
    const notice = result.claimToken
      ? "제출을 생성했습니다. 아래 버튼으로 소유권 연결을 완료해 주세요."
      : result.status === "published"
        ? "프로젝트를 공개했습니다. 바로 상세와 내 프로젝트 화면에서 확인할 수 있습니다."
        : "프로젝트를 제출했습니다. 처리 상태를 내 프로젝트에서 확인해 주세요.";

    return NextResponse.redirect(new URL(buildRedirectPath(targetPath, { notice }), request.url), { status: 303 });
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/submit", {
          error: error instanceof Error ? error.message : "프로젝트 제출에 실패했습니다."
        }),
        request.url
      ),
      { status: 303 }
    );
  }
}
