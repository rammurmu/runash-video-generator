import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Creator - AI Video Creation Platform",
  description: "Create amazing videos with AI-powered tools",
  icons: {
    icon: [
      { url: "/icon.svg" },
      { url: "/favicon.ico" }
    ],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
