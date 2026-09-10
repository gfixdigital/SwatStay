import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: "#12372A",
        river: "#176B87",
        snow: "#F8FAF7",
        mist: "#EEF4F1",
        stone: "#647067",
        charcoal: "#17211B",
        amber: "#C9852B",
        border: "#D9E2DD",
      },
      boxShadow: {
        panel: "0 10px 30px rgba(18, 55, 42, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
