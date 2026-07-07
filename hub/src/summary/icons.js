// 運営が用意する「共通アイコン集」。
// すべて絵文字ベース＝他社の画像を一切含まない＝IPリスクなし。
// pro:true のものは「有料アカウントで解禁」の見本（Canva型フリーミアム）。
// 運営はここに少しずつ追加していける。

export const ICON_LIBRARY = [
  // --- 基本（無料） ---
  { icon: "🎲", name: "サイコロ", pro: false },
  { icon: "🃏", name: "カード", pro: false },
  { icon: "🪙", name: "コイン／お金", pro: false },
  { icon: "🌾", name: "麦／食料", pro: false },
  { icon: "🌲", name: "木材", pro: false },
  { icon: "🧱", name: "レンガ／建材", pro: false },
  { icon: "⚔️", name: "戦闘／攻撃", pro: false },
  { icon: "🛡️", name: "防御", pro: false },
  { icon: "⭐", name: "勝利点", pro: false },
  { icon: "❤️", name: "ライフ／体力", pro: false },
  { icon: "⏳", name: "時間／ラウンド", pro: false },
  { icon: "🏠", name: "建てる／建物", pro: false },
  { icon: "👣", name: "移動", pro: false },
  { icon: "🔄", name: "交換／リロール", pro: false },
  { icon: "✋", name: "手札", pro: false },
  { icon: "🗑️", name: "捨てる", pro: false },
  { icon: "➕", name: "得る／増える", pro: false },
  { icon: "➖", name: "支払う／減る", pro: false },
  // --- 追加（有料アカウントで解禁の見本） ---
  { icon: "🐤", name: "鳥／生き物", pro: true },
  { icon: "🥚", name: "卵", pro: true },
  { icon: "⚙️", name: "エンジン／変換", pro: true },
  { icon: "🧭", name: "探索", pro: true },
  { icon: "🔮", name: "特殊効果", pro: true },
  { icon: "👑", name: "リーダー／親", pro: true },
];

// 無料で使えるアイコンだけを返す
export function freeIcons() {
  return ICON_LIBRARY.filter((i) => !i.pro);
}
