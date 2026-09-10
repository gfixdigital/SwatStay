import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";
export default function LoginPage() { return <><Header/><AuthShell eyebrow="WELCOME BACK" title="Log in to SwatStay" description="Access your trip requests, booking status, and confirmed travel details." image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85"><AuthForm mode="login"/></AuthShell><Footer/></>; }
