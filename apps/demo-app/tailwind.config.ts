import type { Config } from "tailwindcss";
import preset from "@mf-hub/ui/tailwind.preset";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../libraries/ui/src/**/*.{ts,tsx}",
  ],
  presets: [preset],
  plugins: [],
};

export default config;
