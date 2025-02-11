import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    // Proxy requests beginnging /api to gateway
    proxy: {
      "/api": {
        target: "http://api-gateway:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
  },

  // Absolute imports
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
