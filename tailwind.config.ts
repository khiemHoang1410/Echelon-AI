// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Map biến CSS vào Tailwind
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                echelon: {
                    500: "#8b5cf6", // Hoặc dùng var(--primary)
                    900: "#4c1d95",
                }
            },
        },
    },
    plugins: [],
};
export default config;