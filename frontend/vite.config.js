import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { PROXY_TARGET, PROXY_PATH } from "common/constants.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      [PROXY_PATH]: {
        target: PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
});
