// デモ用の簡易回答エンジン。
// 共有デモ（単体HTML）は APIキーを持てないので、本物のAIは呼べない。
// そのかわり、その台本（＝ルール要約）データの中から質問に一番近い箇所を
// 見つけて返す。本番では ask.js が /api/ask 経由で本物のAIに聞く。

const SECTION_LABELS = {
  about: "どんなゲーム？",
  win: "勝利条件",
  setup: "準備",
  flow: "ゲームの流れ",
  turn: "手番でできること",
  scoring: "得点の入り方",
  end: "終了条件",
  special: "特別ルール・例外",
  pitfalls: "つまずきポイント",
  icons: "アイコンの意味",
};

// 質問の意図 → 優先して見るセクション
const INTENTS = [
  { keys: ["win", "scoring"], words: ["勝", "勝ち", "勝利", "勝つ", "勝て", "勝敗", "優勝"] },
  { keys: ["scoring"], words: ["点", "得点", "ポイント", "スコア", "計算", "何点"] },
  { keys: ["end"], words: ["終", "終わり", "終了", "おわり", "いつ終", "最後", "ラスト"] },
  { keys: ["setup"], words: ["準備", "セットアップ", "最初", "配る", "配置", "並べ", "用意"] },
  { keys: ["turn"], words: ["手番", "できること", "アクション", "自分の番", "ターン", "何する", "何ができ"] },
  { keys: ["flow"], words: ["流れ", "進め", "進行", "どうやって進", "順番", "ラウンド"] },
  { keys: ["about"], words: ["どんなゲーム", "概要", "目的", "なにをする", "何をする", "どういう"] },
  { keys: ["special"], words: ["例外", "特別", "特殊", "レアケース", "特殊ルール"] },
  { keys: ["pitfalls"], words: ["注意", "つまず", "間違", "ミス", "コツ", "気をつけ", "よくある"] },
  { keys: ["icons"], words: ["アイコン", "記号", "マーク", "意味", "この絵", "シンボル"] },
];

function normalize(s) {
  return (s || "")
    .replace(/[\s　、。・！？「」（）()【】〜ー…,.!?:：;；]/g, "")
    .toLowerCase();
}

function bigrams(s) {
  const n = normalize(s);
  const out = [];
  for (let i = 0; i < n.length - 1; i++) out.push(n.slice(i, i + 2));
  return out;
}

function overlap(qBigrams, text) {
  const b = new Set(bigrams(text));
  let c = 0;
  for (const g of qBigrams) if (b.has(g)) c++;
  return c;
}

// 台本を「検索できる小片」に分解する
function buildUnits(script) {
  const units = [];
  const push = (key, text) => {
    if (text && String(text).trim()) {
      units.push({ key, label: SECTION_LABELS[key], text: String(text).trim() });
    }
  };
  push("about", script.about);
  push("win", script.win);
  push("setup", script.setup);
  push("flow", script.flow);
  (script.turn || [])
    .filter(Boolean)
    .forEach((t) => units.push({ key: "turn", label: SECTION_LABELS.turn, text: t }));
  push("scoring", script.scoring);
  push("end", script.end);
  push("special", script.special);
  push("pitfalls", script.pitfalls);
  (script.icons || [])
    .filter((g) => g.icon || g.meaning)
    .forEach((g) =>
      units.push({
        key: "icons",
        label: SECTION_LABELS.icons,
        text: `${g.icon} … ${g.meaning}`,
      })
    );
  return units;
}

// 質問に対して、台本から一番近い箇所を返す。
// 戻り値: { text, refs }（refs は参照したセクション名）
export function localAnswer(script, question) {
  const units = buildUnits(script);
  if (units.length === 0) {
    return { text: "この台本にはまだ十分な情報が入っていません。", refs: [] };
  }

  const qb = bigrams(question);
  const intents = INTENTS.filter((it) => it.words.some((w) => question.includes(w)));
  const boostKeys = new Set(intents.flatMap((it) => it.keys));

  const scored = units
    .map((u) => {
      let score = overlap(qb, u.text);
      if (boostKeys.has(u.key)) score += 4;
      return { ...u, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  // ほとんど当たらないとき：意図があればそのセクション、無ければ概要へ誘導
  if (best.score <= 0) {
    const fallback =
      scored.find((u) => boostKeys.has(u.key)) ||
      units.find((u) => u.key === "about") ||
      units[0];
    return {
      text: `ぴったりの答えは見つかりませんでしたが、「${fallback.label}」が近そうです。\n\n${fallback.text}`,
      refs: [fallback.label],
    };
  }

  // 上位＋別セクションの2件目まで拾って、根拠のある範囲で答える
  const picks = [best];
  const second = scored.find(
    (u) => u.key !== best.key && u.score >= Math.max(2, best.score * 0.5)
  );
  if (second) picks.push(second);

  const body = picks.map((p) => `【${p.label}】\n${p.text}`).join("\n\n");
  return { text: body, refs: picks.map((p) => p.label) };
}
