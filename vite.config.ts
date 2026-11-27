import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Dev only: proxy /api to the blog API so the browser avoids the API's CORS rejection
  server: {
    proxy: {
      "/api": {
        target: "https://api.manhoursonhire.com",
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("origin");
            proxyReq.removeHeader("referer");
          });
        },
      },
    },
  },
  // We removed the `ssr: { noExternal: true }` block that was breaking the dev server!
  ssgOptions: {
    script: 'async',
    formatting: 'none',
  },
});