import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: "#1C1414",
        vermelho: "#C8102E",
        vinho: "#8E0E22",
        cinza: "#6E6461",
        nevoa: "#F7F3F1",
        rosado: "#FBECEA",
        linha: "#E8DEDB",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        texto: ["Archivo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
