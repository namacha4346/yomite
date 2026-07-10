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

  // 任意のメタ情報（カタログ表示用）
  const int = (v) => (Number.isFinite(+v) && +v > 0 ? Math.floor(+v) : null);
  const meta = {};
  if (body.players && int(body.players.min) && int(body.players.max)) {
    const a = int(body.players.min);
    const b = int(body.players.max);
    meta.players = { min: Math.min(a, b), max: Math.max(a, b) };
  }
  if (int(body.time)) meta.time = int(body.time);
  const author = String(body.author || "").trim().slice(0, 20);
  if (author) meta.author = author;
  if (Array.isArray(body.mechanics)) {
    const m = body.mechanics
      .map((x) => String(x).trim())
      .filter(Boolean)
      .slice(0, 8);
    if (m.length) meta.mechanics = m;
  }
  // 教える順番（テーマの並び）。既知のテーマIDのみ許可。
  const VALID_THEMES = ["about", "setup", "play", "ref"];
  if (Array.isArray(body.themeOrder)) {
    const order = body.themeOrder
      .map((x) => String(x))
      .filter((id) => VALID_THEMES.includes(id));
    for (const id of VALID_THEMES) if (!order.includes(id)) order.push(id);
    meta.themeOrder = order;
  }

  return { gameTitle, ...meta, ...texts, turn, icons };
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- AIに質問（本物のAIで台本の内容に答える） ---
// フロントの src/ai/ask.js がここを叩く。
// ANTHROPIC_API_KEY が無い／SDK未導入なら 503 を返し、フロントは
// 台本ベースの簡易回答（デモ回答）にフォールバックする。
//   必要なもの: `npm install @anthropic-ai/sdk` と 環境変数 ANTHROPIC_API_KEY
//   任意: ANTHROPIC_MODEL（既定は claude-opus-4-8）
let anthropicClient;
async function getAnthropic() {
  if (anthropicClient !== undefined) return anthropicClient;
  if (!process.env.ANTHROPIC_API_KEY) {
    anthropicClient = null;
    return null;
  }
  try {
    const mod = await import("@anthropic-ai/sdk");
    const Anthropic = mod.default;
    anthropicClient = new Anthropic();
  } catch {
    anthropicClient = null; // SDK未導入
  }
  return anthropicClient;
}

const ASK_SYSTEM = [
  "あなたはボードゲームのインストを手伝うアシスタントです。",
  "利用者から渡された『ルール資料』だけを根拠に、日本語でやさしく短く答えてください。",
  "資料に書かれていないことは推測で断言せず、『台本に記載がないため、公式の説明書をご確認ください』と伝えます。",
  "初心者にも分かるように、必要なら具体例を1つ添えます。前置きや自己紹介は不要です。",
].join("\n");

app.post("/api/ask", async (req, res) => {
  const client = await getAnthropic();
  if (!client) return res.status(503).json({ error: "ai_unconfigured" });

  const question = String(req.body?.question || "").trim().slice(0, 500);
  const context = String(req.body?.context || "").trim().slice(0, 12000);
  const gameTitle = String(req.body?.gameTitle || "").trim().slice(0, 80);
  if (!question || !context) {
    return res.status(400).json({ error: "質問と資料が必要です。" });
  }

  try {
    const message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: ASK_SYSTEM,
      messages: [
        {
          role: "user",
          content: `【ゲーム】${gameTitle}\n\n【ルール資料】\n${context}\n\n【質問】${question}`,
        },
      ],
    });
    const answer = (message.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    res.json({ answer });
  } catch (e) {
    console.error("ask error:", e?.message || e);
    res.status(502).json({ error: "ai_failed" });
  }
});

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
