import type { Metadata } from "next";
import "./globals.css";
import AudioInitializer from "./audio";

export const metadata: Metadata = {
  title: "Dragon Cards Game",
  description: "Dragon Cards Game",
};

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AudioInitializer />
      {children}
    </>
  );
}

