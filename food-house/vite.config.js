import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
   resolve: {
    alias: {
      // This handles the 'global is not defined' error
      global: {},
    },
  },
  define: {
    // Provide browser globals for SockJS
    global: 'window',
  },
});
