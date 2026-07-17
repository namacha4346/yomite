import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// /api はバックエンド（hub/server, :8787）へ転送（プロキシ）する。
const proxy = {
  "/api": {
    target: "http://localhost:8787",
    changeOrigin: true,
  },
};

// VITE_DEMO=1 のときは、全部を1つのHTMLに固めた「触れるデモ」をビルドする。
const demo = process.env.VITE_DEMO === "1";

export default defineConfig({
  plugins: [react(), ...(demo ? [viteSingleFile()] : [])],
  server: { proxy },
  preview: { proxy },
});
