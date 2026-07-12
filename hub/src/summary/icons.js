// 運営が用意する「共通アイコン集」。
// すべて絵文字ベース＝他社の画像を一切含まない＝IPリスクなし（最終判断は法務）。
// pro:true のものは「有料アカウントで解禁」（Canva型フリーミアム）。
// cat でカテゴリ分け（基本／リソース／コマ・進行／アクション／得点・特殊）。
// 方針（staff-6 のガードレール）：
//  - 「無くては台本が成立しない」概念は無料。テーマ性・装飾性の高い変種は PRO。
//  - セットで意味を持つもの（色トークン6色・公開/隠す・得る/支払う）は片方だけ有料にしない。
//  - トークンは丸(●)で統一。ZWJ合成絵文字は小サイズで崩れやすいので PRO 側に寄せる。
//  - 名前は「モノ名／機能名」で最大2語。重複する絵文字は作らない。

// カテゴリの表示順
export const ICON_CATEGORIES = [
  "基本",
  "リソース",
  "コマ・進行",
  "アクション",
  "得点・特殊",
];

export const ICON_LIBRARY = [
  // ============ 基本 ============
  { icon: "🎲", name: "サイコロ", cat: "基本", pro: false },
  { icon: "🃏", name: "カード", cat: "基本", pro: false },
  { icon: "🎴", name: "場札／特殊カード", cat: "基本", pro: false },
  { icon: "✋", name: "手札", cat: "基本", pro: false },
  { icon: "🪙", name: "コイン／お金", cat: "基本", pro: false },
  { icon: "🔢", name: "数字／数値", cat: "基本", pro: false },
  { icon: "📋", name: "お題／テーマ", cat: "基本", pro: false },
  { icon: "💰", name: "財宝／大金", cat: "基本", pro: true },
  { icon: "❓", name: "ランダム／伏せ引き", cat: "基本", pro: true },

  // ============ リソース ============
  { icon: "🌾", name: "麦／穀物", cat: "リソース", pro: false },
  { icon: "🍖", name: "食料（肉）", cat: "リソース", pro: false },
  { icon: "🌲", name: "木／森", cat: "リソース", pro: false },
  { icon: "🧱", name: "レンガ／建材", cat: "リソース", pro: false },
  { icon: "🪨", name: "石／鉱石", cat: "リソース", pro: false },
  { icon: "💎", name: "宝石／ジェム", cat: "リソース", pro: false },
  { icon: "🔴", name: "赤トークン", cat: "リソース", pro: false },
  { icon: "🔵", name: "青トークン", cat: "リソース", pro: false },
  { icon: "🟢", name: "緑トークン", cat: "リソース", pro: false },
  { icon: "🟡", name: "黄／万能・ワイルド", cat: "リソース", pro: false },
  { icon: "⚪", name: "白トークン", cat: "リソース", pro: false },
  { icon: "⚫", name: "黒トークン", cat: "リソース", pro: false },
  { icon: "🟫", name: "茶／粘土", cat: "リソース", pro: true },
  { icon: "🟣", name: "紫トークン", cat: "リソース", pro: true },
  { icon: "🟠", name: "橙トークン", cat: "リソース", pro: true },
  { icon: "🪵", name: "木材／丸太", cat: "リソース", pro: true },
  { icon: "⛏️", name: "採掘／鉱山", cat: "リソース", pro: true },
  { icon: "💧", name: "水", cat: "リソース", pro: true },
  { icon: "🔥", name: "火／燃料", cat: "リソース", pro: true },
  { icon: "📦", name: "物資／商品", cat: "リソース", pro: true },
  { icon: "🥚", name: "卵", cat: "リソース", pro: true },

  // ============ コマ・進行 ============
  { icon: "🧍", name: "コマ／ワーカー", cat: "コマ・進行", pro: false },
  { icon: "👣", name: "移動", cat: "コマ・進行", pro: false },
  { icon: "➡️", name: "次へ／時計回り", cat: "コマ・進行", pro: false },
  { icon: "🔁", name: "ラウンド繰り返し", cat: "コマ・進行", pro: false },
  { icon: "🏁", name: "ゲーム終了／最終", cat: "コマ・進行", pro: false },
  { icon: "🛤️", name: "道／路線", cat: "コマ・進行", pro: false },
  { icon: "🎩", name: "プレイヤー／自分", cat: "コマ・進行", pro: true },
  { icon: "🚩", name: "陣地／自分の場所", cat: "コマ・進行", pro: true },
  { icon: "🧑‍🌾", name: "人／住人", cat: "コマ・進行", pro: true },
  { icon: "↩️", name: "反時計回り／戻す", cat: "コマ・進行", pro: true },
  { icon: "🥇", name: "手番順／1番手", cat: "コマ・進行", pro: true },
  { icon: "🚂", name: "列車／乗り物", cat: "コマ・進行", pro: true },
  { icon: "🗺️", name: "ボード／マップ", cat: "コマ・進行", pro: true },

  // ============ アクション ============
  { icon: "➕", name: "得る／増える", cat: "アクション", pro: false },
  { icon: "➖", name: "支払う／減る", cat: "アクション", pro: false },
  { icon: "🔄", name: "交換／リロール", cat: "アクション", pro: false },
  { icon: "🗑️", name: "捨てる", cat: "アクション", pro: false },
  { icon: "⚔️", name: "戦闘／攻撃", cat: "アクション", pro: false },
  { icon: "🛡️", name: "防御", cat: "アクション", pro: false },
  { icon: "👁️", name: "公開／見る", cat: "アクション", pro: false },
  { icon: "🙈", name: "隠す／伏せる", cat: "アクション", pro: false },
  { icon: "🎯", name: "指定／狙う", cat: "アクション", pro: false },
  { icon: "🤝", name: "交渉／取引", cat: "アクション", pro: true },
  { icon: "🎁", name: "渡す／贈る", cat: "アクション", pro: true },
  { icon: "⚡", name: "早い者勝ち／即時", cat: "アクション", pro: true },
  { icon: "🗣️", name: "発言／宣言", cat: "アクション", pro: true },
  { icon: "🔒", name: "固定／確定", cat: "アクション", pro: true },
  { icon: "🔓", name: "解禁／アンロック", cat: "アクション", pro: true },
  { icon: "🔨", name: "競り／入札", cat: "アクション", pro: true },
  { icon: "⚙️", name: "エンジン／変換", cat: "アクション", pro: true },
  { icon: "🧭", name: "探索", cat: "アクション", pro: true },

  // ============ 得点・特殊 ============
  { icon: "⭐", name: "勝利点", cat: "得点・特殊", pro: false },
  { icon: "🏆", name: "勝利／トロフィー", cat: "得点・特殊", pro: false },
  { icon: "🏰", name: "城／都市", cat: "得点・特殊", pro: false },
  { icon: "🏠", name: "建てる／建物", cat: "得点・特殊", pro: false },
  { icon: "📉", name: "減点／マイナス点", cat: "得点・特殊", pro: false },
  { icon: "❤️", name: "ライフ／体力", cat: "得点・特殊", pro: false },
  { icon: "⏳", name: "時間／ラウンド", cat: "得点・特殊", pro: false },
  { icon: "🎫", name: "目的地／達成目標", cat: "得点・特殊", pro: true },
  { icon: "🏅", name: "ボーナス点", cat: "得点・特殊", pro: true },
  { icon: "🎖️", name: "名声／勲章", cat: "得点・特殊", pro: true },
  { icon: "👑", name: "リーダー／親", cat: "得点・特殊", pro: true },
  { icon: "🔮", name: "特殊効果", cat: "得点・特殊", pro: true },
  { icon: "💥", name: "脱落／破壊", cat: "得点・特殊", pro: true },
  { icon: "🛑", name: "禁止／できない", cat: "得点・特殊", pro: true },
  { icon: "✅", name: "達成／成功", cat: "得点・特殊", pro: true },
  { icon: "⛪", name: "施設（教会）", cat: "得点・特殊", pro: true },
  { icon: "🐤", name: "鳥／生き物", cat: "得点・特殊", pro: true },
];

// 無料で使えるアイコンだけを返す
export function freeIcons() {
  return ICON_LIBRARY.filter((i) => !i.pro);
}

// カテゴリ順にグループ化して返す（[{ cat, items: [...] }]）
export function iconsByCategory() {
  return ICON_CATEGORIES.map((cat) => ({
    cat,
    items: ICON_LIBRARY.filter((i) => i.cat === cat),
  })).filter((g) => g.items.length > 0);
}
