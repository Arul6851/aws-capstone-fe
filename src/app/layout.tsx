import type { Metadata } from "next";
import "./globals.css";
import Lay from "@/components/student/Lay";

export const metadata: Metadata = {
  title: "Licet Fee Portal",
  description: "A Fee payment portal for Licet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Lay>{children}</Lay>;
}
