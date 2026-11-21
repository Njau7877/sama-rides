import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Sama Rides | Move smarter", description: "Reliable everyday mobility, built for Kenya." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }