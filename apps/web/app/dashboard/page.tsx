import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DashboardView } from "@/components/DashboardView";
import { PageEnter } from "@/components/Animated";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Traveler Dashboard", description: "Review SwatStay trip requests, payment proof, itinerary, services, and support requests." };

export default function DashboardPage() { return <><Header/><PageEnter><DashboardView/></PageEnter><Footer/></>; }
