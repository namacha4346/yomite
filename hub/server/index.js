// サマリー共有APIサーバー（バックエンドの土台）。
// フロントはここの /api を叩いて、みんなのサマリーを保存・共有する。
// 認証・決済はまだ無い（次のスライスで追加）。
import express from "express";
import cors from "cors";
import * as db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

// 台本の入力バリデーション。全10セクション必須（テキストは一言でも可）。
// 画像アップは無し＝テキスト/データのみ。
const TEXT_KEYS = [
  "about",
  "win",
  "setup",
  "flow",
  "scoring",
  "end",
  "special",
  "pitfalls",
];

function sanitize(body) {
  if (!body || typeof body !== "object") return null;
  const gameTitle = String(body.gameTitle || "").trim();
  if (!gameTitle) return null;

  const texts = {};
  for (const k of TEXT_KEYS) {
    const v = String(body[k] || "").trim();
    if (!v) return null;
    texts[k] = v;
  }

  const turn = Array.isArray(body.turn)
    ? body.turn.map((s) => String(s)).filter((s) => s.trim())
    : [];
  if (turn.length === 0) return null;

  const icons = Array.isArray(body.icons)
    ? body.icons
        .map((g) => ({
          icon: String(g.icon || ""),
          meaning: String(g.meaning || ""),
        }))
        .filter((g) => g.icon || g.meaning.trim())
    : [];
  if (icons.length === 0) return null;

  return { gameTitle, ...texts, turn, icons };
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// 一覧
app.get("/api/scripts", async (_req, res) => {
  res.json(await db.list());
});

// 追加（更新後の一覧を返す）
app.post("/api/scripts", async (req, res) => {
  const clean = sanitize(req.body);
  if (!clean) {
    return res
      .status(400)
      .json({ error: "全ての項目に入力してください（一言でもOK）。" });
  }
  res.status(201).json(await db.create(clean));
});

// 削除（更新後の一覧を返す）
app.delete("/api/scripts/:id", async (req, res) => {
  res.json(await db.remove(req.params.id));
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`board-hub server listening on http://localhost:${PORT}`);
});
