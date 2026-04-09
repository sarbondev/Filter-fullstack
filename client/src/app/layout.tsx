import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prestige filter - Premium Filter Solutions",
  description:
    "Industrial and household filtration solutions. Water, air, and oil filters manufactured with precision engineering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
