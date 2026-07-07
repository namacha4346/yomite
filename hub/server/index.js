// サマリー共有APIサーバー（バックエンドの土台）。
// フロントはここの /api を叩いて、みんなのサマリーを保存・共有する。
// 認証・決済はまだ無い（次のスライスで追加）。
import express from "express";
import cors from "cors";
import * as db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

// 入力の最低限のバリデーション（画像アップは無し＝テキスト/データのみ）。
function sanitize(body) {
  if (!body || typeof body !== "object") return null;
  const gameTitle = String(body.gameTitle || "").trim();
  const turnActions = Array.isArray(body.turnActions)
    ? body.turnActions.map((s) => String(s)).filter((s) => s.trim())
    : [];
  const endCondition = String(body.endCondition || "").trim();
  if (!gameTitle || turnActions.length === 0 || !endCondition) return null;

  const icons = Array.isArray(body.icons)
    ? body.icons
        .map((g) => ({
          icon: String(g.icon || ""),
          meaning: String(g.meaning || ""),
        }))
        .filter((g) => g.icon || g.meaning)
    : [];

  const side = (v, d) => (v === "front" || v === "back" ? v : d);
  return {
    gameTitle,
    turnActions,
    endCondition,
    icons,
    turnActionsSide: side(body.turnActionsSide, "front"),
    endConditionSide: side(body.endConditionSide, "front"),
    iconsSide: side(body.iconsSide, "back"),
  };
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// 一覧
app.get("/api/summaries", async (_req, res) => {
  res.json(await db.list());
});

// 追加（更新後の一覧を返す）
app.post("/api/summaries", async (req, res) => {
  const clean = sanitize(req.body);
  if (!clean) {
    return res
      .status(400)
      .json({ error: "ゲーム名・手番でできること・終了条件は必須です。" });
  }
  res.status(201).json(await db.create(clean));
});

// 削除（更新後の一覧を返す）
app.delete("/api/summaries/:id", async (req, res) => {
  res.json(await db.remove(req.params.id));
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`board-hub server listening on http://localhost:${PORT}`);
});
