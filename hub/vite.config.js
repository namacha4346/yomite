import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ひながた用の最小設定。react プラグインだけ入れておく。
export default defineConfig({
  plugins: [react()],
});
