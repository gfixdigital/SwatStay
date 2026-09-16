import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to SwatStay",
  description: "Learn how SwatStay helps travelers plan call-confirmed Swat trips with local provider support.",
  openGraph: {
    title: "Welcome to SwatStay",
    description: "A practical introduction to planning a Swat trip with SwatStay.",
    type: "website",
  },
};

export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
