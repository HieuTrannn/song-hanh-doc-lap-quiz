import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Party — HCM202",
  description: "Party quiz game phong cách Quiz.com cho môn Tư tưởng Hồ Chí Minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
