import type { Metadata } from "next";

export const metadata: Metadata = { title: "Request Data Deletion | SwatStay", description: "Prepare a frontend-only request for SwatStay to review removal or anonymization of eligible personal information." };

export default function DataDeletionLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
