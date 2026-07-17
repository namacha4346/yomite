import { LibIcon } from "../ui/graphics.jsx";

// 台本本文に混ざっている「生の絵文字」を、対応する自作アイコン(id)へ置き換える。
// 対応のない記号（矢印→・囲み数字①・動物・カード番号1〜8 など）はそのまま残す。
// value が "" の絵文字（例：麻雀牌🀄）は削除する。
const EMOJI_TO_ID = {
  "⭐": "vp", "🃏": "deck", "💎": "gem", "🪙": "coins", "🧍": "worker",
  "🗣": "speak", "🛒": "shop", "🎴": "deck", "🗑": "trash", "🏰": "castle",
  "🏁": "flag", "🔁": "recycle", "🛤": "road", "🎫": "ticket", "⚡": "bell",
  "📋": "topic", "🦅": "bird", "🏆": "trophy", "🔢": "number", "⚖": "scales",
  "🏠": "house", "🎲": "dice", "➕": "get", "➖": "pay", "❤": "life",
  "⬆": "upgrade", "👀": "eye",
  "🀄": "", // 不要（麻雀牌）＝削除
  // 絵文字そのものが id（FE0F を外した形。ICON_BY_ID が別名も持つので解決できる）
  "🟢": "🟢", "🔵": "🔵", "🔴": "🔴", "⚪": "⚪", "⚫": "⚫", "🟡": "🟡",
  "🟫": "🟫", "🟣": "🟣", "🟠": "🟠", "🌾": "🌾", "🍖": "🍖", "🌲": "🌲",
  "🪨": "🪨", "🚂": "🚂", "🛡": "🛡", "🎯": "🎯", "🗺": "🗺", "🚩": "🚩",
  "🔮": "🔮", "👑": "👑", "💥": "💥", "🤝": "🤝", "⚔": "⚔",
};

const KEYS = Object.keys(EMOJI_TO_ID);
// 各絵文字＋任意の FE0F を1トークンとして切り出す正規表現
const SPLIT_RE = new RegExp("(" + KEYS.map((k) => k + "️?").join("|") + ")", "gu");
const idFor = (tok) => EMOJI_TO_ID[tok.replace(/️/g, "")];

// 文字列を「文字列 / インラインアイコン」の配列に分解して描画する。
export default function Iconize({ text }) {
  if (text == null) return null;
  const segs = String(text).split(SPLIT_RE);
  return (
    <>
      {segs.map((seg, i) => {
        if (i % 2 === 1) {
          const id = idFor(seg);
          if (!id) return null; // 空マッピング＝削除
          return <LibIcon key={i} value={id} className="inline-ic" />;
        }
        return seg;
      })}
    </>
  );
}

// プレーンテキストが必要な場所（レイアウト編集のボックス等）用：
// 対応アイコンのある絵文字を取り除いて、前後の空白を整える。
export function stripEmoji(text) {
  return String(text || "")
    .replace(SPLIT_RE, (m) => (idFor(m) === "" ? "" : ""))
    .replace(/\s{2,}/g, " ")
    .trim();
}
