import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalSimplifier",
  description: "Simplify and analyze legal documents with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
