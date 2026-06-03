import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global AI News Tracker",
  description: "Real-time global AI news intelligence dashboard with AI summaries, trends, and daily briefings."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
