import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "localhost",
    port: 5173,
    proxy: {
      // Proxy API requests to the backend
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy WebSocket connections - disable changeOrigin to avoid header rewriting issues
      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: false, // Don't rewrite Origin/Host headers
        rewrite: (path) => path, // Don't modify the path
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
