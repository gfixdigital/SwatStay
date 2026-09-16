import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TravelerSupportCenter } from "@/components/TravelerSupportCenter";

export const metadata: Metadata = { title: "Trip Support", description: "Review and submit SwatStay booking support requests." };

export default function TravelerSupportPage() { return <><Header/><TravelerSupportCenter/><Footer/></>; }
