import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /webhook to http://localhost:3001/webhook
      "/webhook": "http://localhost:3001",

      // Forward /send to http://localhost:3001/send
      "/send": "http://localhost:3001",
    },
  },
});
