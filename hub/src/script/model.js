import { withSides } from "../summary/model.js";
import { THEMES } from "./sections.js";

// テーマ（教えるタブ）のデフォルト順＝公式順
export const DEFAULT_THEME_ORDER = THEMES.map((t) => t.id);

// 台本の themeOrder を正規化（不正値を除き、足りないテーマは末尾に補う）
export function normalizeThemeOrder(order) {
  const valid = Array.isArray(order)
    ? order.filter((id) => THEMES.some((t) => t.id === id))
    : [];
  for (const t of THEMES) if (!valid.includes(t.id)) valid.push(t.id);
  return valid;
}

// 空の台本（エディタの初期値）
export function emptyScript() {
  return {
    gameTitle: "",
    playersMin: "",
    playersMax: "",
    timeMin: "",
    mechanics: [],
    themeOrder: DEFAULT_THEME_ORDER.slice(),
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

// 既存の台本 → エディタのフォーム形へ変換（フォーク＝自分版づくりの下敷き）。
export function scriptToForm(s) {
  const base = emptyScript();
  if (!s) return base;
  return {
    ...base,
    gameTitle: s.gameTitle || "",
    playersMin: s.players && s.players.min != null ? String(s.players.min) : "",
    playersMax: s.players && s.players.max != null ? String(s.players.max) : "",
    timeMin: s.time != null ? String(s.time) : "",
    mechanics: Array.isArray(s.mechanics) ? [...s.mechanics] : [],
    themeOrder: normalizeThemeOrder(s.themeOrder),
    about: s.about || "",
    win: s.win || "",
    setup: s.setup || "",
    flow: s.flow || "",
    turn: Array.isArray(s.turn) && s.turn.length ? [...s.turn] : [""],
    scoring: s.scoring || "",
    end: s.end || "",
    icons:
      Array.isArray(s.icons) && s.icons.length
        ? s.icons.map((g) => ({ icon: g.icon || "", meaning: g.meaning || "" }))
        : [{ icon: "", meaning: "" }],
    special: s.special || "",
    pitfalls: s.pitfalls || "",
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
    mechanics: s.mechanics, // 表紙色（gameColor）を計算するために持たせる
    color: s.color,
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
