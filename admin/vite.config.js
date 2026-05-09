import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server/index.js";

export default defineConfig(({ mode }) => ({
  // Serve the site from the client/ folder so index.html lives there
  root: path.resolve(__dirname, "./client"),
  server: {
    // bind only to localhost for local-only hosting
    host: "localhost",
    port: 5172,
    fs: {
      allow: [path.resolve(__dirname, "./client"), path.resolve(__dirname, "./shared")],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin() {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
