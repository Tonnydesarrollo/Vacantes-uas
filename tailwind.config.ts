import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "uas-dark-green": "#0b3d2e",
        "uas-white": "#ffffff",
        "uas-gold": "#c9a227",
        "uas-indigo": "#1a2a6c",
      },
    },
  },
  plugins: [animate],
};
export default config;
