import { localAnswer } from "./localAnswer.js";

// 共有デモ（単体HTML）は APIキーもサーバーも無いので、常に簡易回答。
const DEMO =
  import.meta.env.VITE_DEMO === "1" || import.meta.env.VITE_DEMO === true;

// 台本を、AIへ渡す「ルール資料」テキストにまとめる
export function buildContext(script) {
  const lines = [];
  const add = (label, text) => {
    if (text && String(text).trim()) lines.push(`■${label}\n${String(text).trim()}`);
  };
  add("どんなゲーム", script.about);
  add("勝利条件", script.win);
  add("準備", script.setup);
  add("ゲームの流れ", script.flow);
  const turns = (script.turn || []).filter(Boolean);
  if (turns.length) {
    add("手番でできること", turns.map((t, i) => `${i + 1}. ${t}`).join("\n"));
  }
  add("得点の入り方", script.scoring);
  add("終了条件", script.end);
  add("特別ルール・例外", script.special);
  add("つまずきポイント", script.pitfalls);
  const icons = (script.icons || []).filter((g) => g.icon || g.meaning);
  if (icons.length) {
    add("アイコン", icons.map((g) => `${g.icon}=${g.meaning}`).join(" / "));
  }
  return lines.join("\n\n");
}

// 質問に答える。
// - フルアプリ（バックエンド＋APIキー有り）: /api/ask 経由で本物のAIが回答
// - デモ／サーバー未設定: 台本ベースの簡易回答（mode: "demo"）
// 戻り値: { text, mode: "ai" | "demo", refs }
export async function ask(script, question) {
  if (!DEMO) {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          gameTitle: script.gameTitle,
          context: buildContext(script),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.answer) return { text: data.answer, mode: "ai", refs: [] };
      }
      // 503（AI未設定）などは簡易回答にフォールバック
    } catch {
      // ネットワーク不通 → 簡易回答へ
    }
  }
  const { text, refs } = localAnswer(script, question);
  return { text, mode: "demo", refs };
}
