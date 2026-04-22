import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/login": "http://127.0.0.1:5000",
      "/doctors": "http://127.0.0.1:5000",
      "/appointments": "http://127.0.0.1:5000",
      "/book-appointment": "http://127.0.0.1:5000"
    }
  }
});
