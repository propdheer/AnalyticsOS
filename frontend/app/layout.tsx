import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnalyticsOS",
  description: "Local-first Professional Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
