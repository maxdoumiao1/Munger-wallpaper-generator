import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Munger Wallpaper Generator",
  description: "Choose a principle, make it a wallpaper.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
