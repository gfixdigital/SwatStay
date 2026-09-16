import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { OnboardingGate } from "@/components/OnboardingGate";
import { LiveSupport } from "@/components/LiveSupport";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
export const metadata: Metadata = { title: { default: "SwatStay | Verified Swat Tour Packages", template: "%s | SwatStay" }, description: "Book call-confirmed Swat tour packages with hotels, transport, meals, guides, and local provider support.", openGraph: { type: "website", siteName: "SwatStay", title: "SwatStay | Verified Swat Tour Packages", description: "Book call-confirmed Swat tour packages with local provider support." } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${inter.variable} ${manrope.variable}`}><OnboardingGate>{children}</OnboardingGate><LiveSupport/></body></html>; }
