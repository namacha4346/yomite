// 統一されたフラットアイコン群とゲームのアートサムネイル。
// 絵文字を使わず、インラインSVG（線画）でトーンを揃える。
// 追加ライブラリなし。色は currentColor / CSS 変数で受け渡す。
import { gameColor } from "./gameColor.js";
import { ICON_BY_ID } from "../summary/icons.js";

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// ---- UIアイコン（小） ----
const UI = {
  users: (
    <svg {...svgProps}>
      <circle cx="9" cy="8.5" r="2.6" />
      <path d="M4 18c0-2.6 2.2-4.2 5-4.2s5 1.6 5 4.2" />
      <path d="M15.5 6.4a2.4 2.4 0 0 1 0 4.5" />
      <path d="M16.4 13.9c2.2.3 3.8 1.8 3.8 4.1" />
    </svg>
  ),
  clock: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2l2.8 1.8" />
    </svg>
  ),
  gauge: (
    <svg {...svgProps}>
      <path d="M5 18a7 7 0 1 1 14 0" />
      <path d="M12 14l3.2-3.2" />
      <circle cx="12" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  search: (
    <svg {...svgProps}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.6-3.6" />
    </svg>
  ),
  arrow: (
    <svg {...svgProps}>
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  ),
  book: (
    <svg {...svgProps}>
      <path d="M12 6.5C10.6 5.6 8.7 5 6.5 5H4v12.5h2.5c2.2 0 4.1.6 5.5 1.5" />
      <path d="M12 6.5C13.4 5.6 15.3 5 17.5 5H20v12.5h-2.5c-2.2 0-4.1.6-5.5 1.5" />
      <path d="M12 6.5V19" />
    </svg>
  ),
  pin: (
    <svg {...svgProps}>
      <path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  ),
  compass: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M15.2 8.8l-1.7 4.7-4.7 1.7 1.7-4.7 4.7-1.7Z" />
    </svg>
  ),
  print: (
    <svg {...svgProps}>
      <path d="M7 9V4h10v5" />
      <path d="M7 18H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
      <rect x="7" y="15" width="10" height="5" rx="1" />
    </svg>
  ),
  heart: (
    <svg {...svgProps}>
      <path d="M12 20s-6.6-4.3-9-8.1C1.3 9 2.6 5.6 6 5.6c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 4.7 3.4 3 6.3-2.4 3.8-9 8.1-9 8.1Z" />
    </svg>
  ),
};

export function Icon({ name, className = "" }) {
  const g = UI[name];
  if (!g) return null;
  return (
    <span className={"icn " + className} aria-hidden="true">
      {g}
    </span>
  );
}

// 共通アイコン集の1個を描画する。
// ・svg を持てば線画SVG（currentColor）
// ・color を持てば「フラット単色ディスク」（色トークン）
// ・どちらも無ければ emoji／生の文字（絵文字台本の後方互換）
export function LibIcon({ value, className = "" }) {
  const it = ICON_BY_ID[value] || ICON_BY_ID[String(value).replace(/️/g, "")];
  if (it && it.svg) {
    return (
      <svg
        className={"lib-icon " + className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: it.svg }}
      />
    );
  }
  if (it && it.color) {
    return (
      <svg
        className={"lib-icon lib-token " + className}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" fill={it.color} stroke="rgba(60,44,20,0.24)" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <span className={"lib-emoji " + className} aria-hidden="true">
      {(it && it.emoji) || value}
    </span>
  );
}

// ---- ゲームのエンブレム（アートサムネイル用・線画） ----
// viewBox 0 0 48 48。currentColor（白系）で描く。
const emblemProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const dot = (cx, cy, r = 1.7) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

const EMBLEMS = {
  splendor: (
    <svg {...emblemProps}>
      <path d="M14 20 L24 10 L34 20 L24 40 Z" />
      <path d="M14 20 H34" />
      <path d="M24 10 L20 20 L24 40" />
      <path d="M24 10 L28 20 L24 40" />
    </svg>
  ),
  // デッキ構築＝「束（デッキ）を育てる」を、少しずつずらして重ねた3枚で表す
  dominion: (
    <svg {...emblemProps}>
      <rect x="12" y="17" width="15" height="20" rx="2.5" />
      <rect x="15.5" y="14" width="15" height="20" rx="2.5" />
      <rect x="19" y="11" width="15" height="20" rx="2.5" />
    </svg>
  ),
  carcassonne: (
    <svg {...emblemProps}>
      <path d="M13 38V22h4v-4h4v4h6v-4h4v4h4v16Z" />
      <path d="M21 38v-6h6v6" />
    </svg>
  ),
  // 石斧＝石器時代の道具。斜めの柄＋刃先が湾曲した幅広の石刃＋接合部の結束線。
  "stone-age": (
    <svg {...emblemProps}>
      <path d="M16 35 L27 16" />
      <path d="M23 11 L32 15 Q35 19 31 23 L25 19.5 Z" />
      <path d="M24.5 15 L28.5 17.4" />
    </svg>
  ),
  // 列車ゲームの一意な記号＝機関車。運転席＋ボイラー＋煙突＋車輪。
  "ticket-to-ride": (
    <svg {...emblemProps}>
      <path d="M13 28 V16 H23 V21 H34 V28 Z" />
      <path d="M28 21 V15 H32 V21" />
      <rect x="15.5" y="19" width="5" height="4.6" rx="0.9" />
      <circle cx="17.5" cy="31" r="2.6" />
      <circle cx="29" cy="31" r="2.6" />
    </svg>
  ),
  nanjamonja: (
    <svg {...emblemProps}>
      <path d="M16 28a8 9 0 0 1 16 0v3a8 5 0 0 1-16 0Z" />
      {dot(21, 27, 1.5)}
      {dot(27, 27, 1.5)}
      <path d="M20 34v3M28 34v3" />
    </svg>
  ),
  // 核＝「小さい順に並べる」。昇順に上がる点列＋上向きの矢じり（糸で結ぶ含意も）。
  ito: (
    <svg {...emblemProps}>
      <path d="M13 33 L22 27 L31 21" />
      <path d="M28.8 25.5 L31 21 L26 20.6" />
      {dot(13, 33, 2.2)}
      {dot(22, 27, 2.2)}
    </svg>
  ),
  "love-letter": (
    <svg {...emblemProps}>
      <rect x="12" y="16" width="24" height="17" rx="2.5" />
      <path d="M12 18 L24 27 L36 18" />
      <path d="M24 30c1.6-1.6 3.4-2.4 3.4-4a1.7 1.7 0 0 0-3.4-.6 1.7 1.7 0 0 0-3.4.6c0 1.6 1.8 2.4 3.4 4Z" />
    </svg>
  ),
  "cockroach-poker": (
    <svg {...emblemProps}>
      <ellipse cx="24" cy="27" rx="7" ry="10" />
      <path d="M24 19v16" />
      <path d="M17 22l-4-3M17 27h-5M17 32l-4 3M31 22l4-3M31 27h5M31 32l4 3" />
      <path d="M21 17l-2-4M27 17l2-4" />
    </svg>
  ),
  // ハゲタカ＝獲物の上を旋回する猛禽。翼を広げた上からのシルエット＋尾。
  vulture: (
    <svg {...emblemProps}>
      <path d="M24 20 C20 24 15 24.5 9 28 C16 26.5 20 27.5 24 25 C28 27.5 32 26.5 39 28 C33 24.5 28 24 24 20 Z" />
      <path d="M22 29 L24 34 L26 29" />
    </svg>
  ),
  "sample-script-1": (
    <svg {...emblemProps}>
      <path d="M24 38V16" />
      <path d="M24 20q4-1 6-5M24 20q-4-1-6-5" />
      <path d="M24 26q4-1 6-5M24 26q-4-1-6-5" />
      <path d="M24 32q4-1 6-5M24 32q-4-1-6-5" />
    </svg>
  ),
  _default: (
    <svg {...emblemProps}>
      <rect x="11" y="11" width="26" height="26" rx="6" />
      {dot(18, 18)}
      {dot(30, 18)}
      {dot(24, 24)}
      {dot(18, 30)}
      {dot(30, 30)}
    </svg>
  ),
};

// ゲームのアートサムネイル：色のグラデ地＋線画エンブレム。
// 表紙の色はメカニクスから決める（gameColor）。
export function GameArt({ game, className = "" }) {
  const color = gameColor(game);
  const emblem = (game && EMBLEMS[game.id]) || EMBLEMS._default;
  return (
    <span className={"art " + className} style={{ "--art": color }} aria-hidden="true">
      <span className="art-emblem">{emblem}</span>
    </span>
  );
}
