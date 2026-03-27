import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000"),
  title: {
    default: "바이브 쇼케이스",
    template: "%s | 바이브 쇼케이스"
  },
  description: "바이브코딩으로 만든 프로젝트를 바로 눌러보고, 피드백과 업데이트를 따라가는 프로젝트 중심 쇼케이스 허브",
  openGraph: {
    title: "바이브 쇼케이스",
    description: "프로젝트 중심 쇼케이스 허브",
    type: "website"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getCurrentProfile();

  return (
    <html lang="ko">
      <body className="min-h-screen text-foreground antialiased">
        <div className="min-h-screen">
          <SiteHeader viewer={viewer} />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
