import type { Config } from "tailwindcss";

const config: Config = {
  // Sử dụng class .dark để điều khiển dark mode
  // -> Phù hợp với ThemeContext (toggle thêm/bớt class "dark" trên <html>)
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

