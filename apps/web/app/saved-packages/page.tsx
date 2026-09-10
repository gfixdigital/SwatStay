import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageEnter } from "@/components/Animated";
import { SavedPackagesContent } from "@/components/SavedPackagesContent";

export const metadata: Metadata = { title: "Saved Swat Packages | SwatStay", description: "Review Swat tour packages saved on this device." };

export default function SavedPackagesPage() {
  return <><Header/><PageEnter><main className="section"><SavedPackagesContent/></main></PageEnter><Footer/></>;
}
