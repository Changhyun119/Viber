import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000"),
  title: {
    default: "Viber",
    template: "%s | Viber"
  },
  description: "바이브코딩으로 만든 프로젝트를 발견하고, 피드백하고, 함께 성장하는 커뮤니티",
  openGraph: {
    title: "Viber",
    description: "바이브코딩 프로젝트 커뮤니티",
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
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}})()`,
          }}
        />
      </head>
      <body className="min-h-screen text-foreground antialiased">
        <ThemeProvider>
          <div className="min-h-screen">
            <SiteHeader viewer={viewer} />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        {/* 랜딩 페이지에서 공통 헤더/푸터 숨기기 */}
        <style dangerouslySetInnerHTML={{ __html: `
          .landing-fullpage ~ * { display: none; }
          .landing-fullpage { margin-top: -56px; }
          body:has(.landing-fullpage) > div > div > header,
          body:has(.landing-fullpage) > div > div > footer { display: none !important; }
        ` }} />
      </body>
    </html>
  );
}
