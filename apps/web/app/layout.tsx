import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { OnboardingGate } from "@/components/OnboardingGate";
import { LiveSupport } from "@/components/LiveSupport";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
export const metadata: Metadata = { title: "SwatStay | Travel Swat with local operators", description: "Book verified Swat tour packages with local operators." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${inter.variable} ${manrope.variable}`}><OnboardingGate>{children}</OnboardingGate><LiveSupport/></body></html>; }
