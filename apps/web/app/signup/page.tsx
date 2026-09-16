import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Create an Account", description: "Create a SwatStay traveler account preview to manage travel requests." };
export default function SignupPage() { return <><Header/><AuthShell eyebrow="START PLANNING" title="Create your SwatStay account" description="Add your traveler details once, then keep every trip request and booking in one place." image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85"><AuthForm mode="signup"/></AuthShell><Footer/></>; }
