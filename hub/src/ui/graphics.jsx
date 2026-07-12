// 統一されたフラットアイコン群とゲームのアートサムネイル。
// 絵文字を使わず、インラインSVG（線画）でトーンを揃える。
// 追加ライブラリなし。色は currentColor / CSS 変数で受け渡す。
import { gameColor } from "./gameColor.js";

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
  dominion: (
    <svg {...emblemProps}>
      <rect x="17" y="12" width="16" height="22" rx="2.5" transform="rotate(9 25 23)" />
      <rect x="14" y="13" width="16" height="22" rx="2.5" transform="rotate(-7 22 24)" />
    </svg>
  ),
  carcassonne: (
    <svg {...emblemProps}>
      <path d="M13 38V22h4v-4h4v4h6v-4h4v4h4v16Z" />
      <path d="M21 38v-6h6v6" />
    </svg>
  ),
  "stone-age": (
    <svg {...emblemProps}>
      <path d="M15 36 L29 20" />
      <path d="M27 11 L37 20 L28 24 Q23 17 27 11 Z" />
    </svg>
  ),
  "ticket-to-ride": (
    <svg {...emblemProps}>
      {dot(13, 30, 2.4)}
      {dot(35, 18, 2.4)}
      <path d="M13 30 C 20 30, 22 18, 30 18" />
      <path d="M30 18 h5" />
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
  ito: (
    <svg {...emblemProps}>
      {dot(12, 32, 2.2)}
      {dot(36, 20, 2.2)}
      <path d="M12 32 C 20 32, 18 18, 26 18 S 32 28, 36 20" />
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
  vulture: (
    <svg {...emblemProps}>
      <path d="M11 19 Q 24 10 37 19 Q 30 21 25 19 Q 22 30 18 30 Q 20 23 11 19 Z" />
      {dot(15, 18, 1.2)}
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
