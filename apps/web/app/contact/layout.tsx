import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SwatStay | Trip Planning Support",
  description: "Contact SwatStay about packages, custom trips, booking requests, and active trip support.",
  openGraph: { title: "Contact SwatStay", description: "Get practical help planning a Swat trip.", type: "website" },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
