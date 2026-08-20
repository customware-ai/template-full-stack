import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 200,
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    react({ compiler: true }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
