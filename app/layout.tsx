import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "진로설계 나침반 | Career Reflection Lab",
  description: "흥미, 가치, 역량, 준비도를 구조화해 이해하는 교육용 진로성찰 도구"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
