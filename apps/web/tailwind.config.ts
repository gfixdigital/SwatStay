import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: { extend: { colors: { pine: "#12372A", river: "#176B87", snow: "#F8FAF7", mist: "#EEF4F1", stone: "#647067", charcoal: "#17211B", amber: "#C9852B", border: "#D9E2DD" }, fontFamily: { sans: ["var(--font-inter)"], display: ["var(--font-manrope)"] }, borderRadius: { brand: "8px" }, boxShadow: { editorial: "0 16px 40px rgba(18,55,42,.12)" } } },
  plugins: []
};
export default config;
