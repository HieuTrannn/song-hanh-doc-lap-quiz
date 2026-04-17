import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Đường Tới Vững Bền - HCM202",
  description: "Game quiz Đường Tới Vững Bền — Tư tưởng Hồ Chí Minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
