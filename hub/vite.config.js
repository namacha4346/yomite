import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ひながた用の最小設定。
// /api はバックエンド（hub/server, :8787）へ転送（プロキシ）する。
const proxy = {
  "/api": {
    target: "http://localhost:8787",
    changeOrigin: true,
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
