import { withSides } from "../summary/model.js";

// 空の台本（エディタの初期値）
export function emptyScript() {
  return {
    gameTitle: "",
    about: "",
    win: "",
    setup: "",
    flow: "",
    turn: [""],
    scoring: "",
    end: "",
    icons: [{ icon: "", meaning: "" }],
    special: "",
    pitfalls: "",
  };
}

// 台本 → サマリー（早見表）を自動生成。
// ⑤手番でできること / ⑦終了条件 / ⑧アイコン早見表 を取り出し、
// 既存の表裏レイアウト（手番=表・終了=表・アイコン=裏）で表示する。
export function deriveSummary(s) {
  return withSides({
    id: s.id,
    official: s.official,
    gameTitle: s.gameTitle,
    turnActions: (s.turn || []).filter(Boolean),
    endCondition: s.end || "",
    icons: (s.icons || []).filter((g) => g.icon || g.meaning),
    turnActionsSide: "front",
    endConditionSide: "front",
    iconsSide: "back",
  });
}

// 保存できる状態か（全項目必須。テキストは一言でも可＝空でなければOK）
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
export function isComplete(s) {
  if (!s.gameTitle.trim()) return false;
  if (!TEXT_KEYS.every((k) => (s[k] || "").trim())) return false;
  if (!(s.turn || []).some((t) => t.trim())) return false;
  if (!(s.icons || []).some((g) => g.icon || (g.meaning || "").trim())) return false;
  return true;
}
