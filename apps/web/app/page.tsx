import type { Metadata } from "next";
import HomePageContent from "./HomePageContent";

export const metadata: Metadata = {
  title: "SwatStay - Verified Swat Tour Packages",
  description: "Book call-confirmed Swat tour packages with hotels, transport, meals, guides, and local provider support.",
  openGraph: {
    title: "SwatStay - Verified Swat Tour Packages",
    description: "Practical Swat travel planning with reviewed local providers and call-confirmed bookings.",
    type: "website",
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
