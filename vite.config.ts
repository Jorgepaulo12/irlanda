import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const devApiTarget =
  process.env.VITE_DEV_API_TARGET?.replace(/\/$/, "") ?? "http://84.247.136.129";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    port: 5174,
    proxy: {
      "/api": { target: devApiTarget, changeOrigin: true, ws: true },
      "/uploads": { target: devApiTarget, changeOrigin: true },
    },
  },
  preview: {
    port: 4174,
    proxy: {
      "/api": { target: devApiTarget, changeOrigin: true, ws: true },
      "/uploads": { target: devApiTarget, changeOrigin: true },
    },
  },
});