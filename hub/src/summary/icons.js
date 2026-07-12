// 運営が用意する「共通アイコン集」。
// 方針（社長決定）：アイコンは無料/PROで“同じもの”を使う。無料は使える量を限定、PROで全解禁。
//   → 1つの統一トーンの自作SVGアイコン集を基盤にする（staff-6 デザイン・第1〜2弾）。
// スタイル（graphics.jsx の UI と同じ）：viewBox 0 0 24 24・線1色・stroke1.8・角丸・塗りは意味ドットのみ。
//   svg プロパティ = <svg> の“中身”だけ（親が stroke 等を付ける。塗りドットのみ fill/stroke を明示）。
// 色トークンだけは「色が意味の核」なので emoji のまま（1色線では色を表せない。丸で統一）。
//   → 描画は graphics.jsx の <LibIcon value>（svg があれば線画、無ければ emoji/生文字）。
// id：SVGは英字id、絵文字エントリは絵文字そのものをid（既存の絵文字台本と後方互換／自動でSVGに昇格）。
// pro:false=無料で使える（必須サブセット）、pro:true=PROで解禁。
//   セットで意味を持つもの（色6色・公開/隠す・得る/支払う）は片方だけ有料にしない。

export const ICON_CATEGORIES = ["基本", "リソース", "コマ・進行", "アクション", "得点・特殊"];

// 塗りドット（意味の核のみ）
const d = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;

export const ICON_LIBRARY = [
  // ============ 基本 ============
  { id: "dice", name: "サイコロ", cat: "基本", pro: false,
    svg: `<rect x="4.5" y="4.5" width="15" height="15" rx="3"/>${d(8,8,1.3)}${d(16,8,1.3)}${d(12,12,1.3)}${d(8,16,1.3)}${d(16,16,1.3)}` },
  { id: "deck", name: "山札／デッキ", cat: "基本", pro: false,
    svg: `<rect x="5" y="8" width="10" height="13" rx="1.6"/><rect x="7.5" y="6" width="10" height="13" rx="1.6"/><rect x="10" y="4" width="10" height="13" rx="1.6"/>` },
  { id: "cardback", name: "隠す／伏せる", cat: "基本", pro: false,
    svg: `<rect x="6" y="4" width="12" height="16" rx="1.8"/><rect x="8.3" y="6.3" width="7.4" height="11.4" rx="1"/>${d(12,12,1.4)}` },
  { id: "eye", name: "公開／見る", cat: "基本", pro: false,
    svg: `<path d="M3.5 12 C6 7.7 9.3 6 12 6 C14.7 6 18 7.7 20.5 12 C18 16.3 14.7 18 12 18 C9.3 18 6 16.3 3.5 12 Z"/><circle cx="12" cy="12" r="2.6"/>${d(12,12,1)}` },
  { id: "number", name: "数字／数値", cat: "基本", pro: true,
    svg: `<path d="M9.5 5 L7.5 19"/><path d="M16.5 5 L14.5 19"/><path d="M5.5 10 H18.5"/><path d="M5 14 H18"/>` },
  { id: "topic", name: "お題／テーマ", cat: "基本", pro: true,
    svg: `<rect x="5.5" y="5" width="13" height="15" rx="2"/><rect x="9" y="3.5" width="6" height="3" rx="1"/><path d="M8.5 11 H15.5"/><path d="M8.5 14.5 H13.5"/>` },
  { id: "random", name: "ランダム／伏せ引き", cat: "基本", pro: true,
    svg: `<path d="M8.8 8.8 C8.8 6.4 10.6 5 12.3 5 C14.2 5 15.6 6.3 15.6 8 C15.6 10.6 12 10.6 12 13.2"/>${d(12,17.6,1.3)}` },

  // ============ リソース ============
  { id: "cube", name: "資源キューブ", cat: "リソース", pro: false,
    svg: `<path d="M12 4 L19 8 L19 16 L12 20 L5 16 L5 8 Z"/><path d="M5 8 L12 12 L19 8"/><path d="M12 12 L12 20"/>` },
  { id: "coins", name: "コインの山／資金", cat: "リソース", pro: false,
    svg: `<ellipse cx="12" cy="8" rx="6.5" ry="2.6"/><path d="M5.5 8 V14"/><path d="M18.5 8 V14"/><path d="M5.5 14 A6.5 2.6 0 0 0 18.5 14"/><path d="M5.5 11 A6.5 2.6 0 0 0 18.5 11"/>` },
  // 色トークン：色が意味の核。1色線では色を出せないので「フラット単色ディスク」で本体セットと馴染ませる。
  // 6色は無料でセット。id は絵文字のまま（既存の絵文字台本と後方互換／自動でディスク化）。
  { id: "🔴", name: "赤トークン", cat: "リソース", pro: false, color: "#d94f45" },
  { id: "🔵", name: "青トークン", cat: "リソース", pro: false, color: "#3f78c9" },
  { id: "🟢", name: "緑トークン", cat: "リソース", pro: false, color: "#4c9a5a" },
  { id: "🟡", name: "黄／万能・ワイルド", cat: "リソース", pro: false, color: "#e6b23c" },
  { id: "⚪", name: "白トークン", cat: "リソース", pro: false, color: "#faf8f2" },
  { id: "⚫", name: "黒トークン", cat: "リソース", pro: false, color: "#3a352e" },
  { id: "barrel", name: "樽／物資", cat: "リソース", pro: true,
    svg: `<path d="M7 5.5 C4.3 9 4.3 15 7 18.5"/><path d="M17 5.5 C19.7 9 19.7 15 17 18.5"/><path d="M7 5.5 H17"/><path d="M7 18.5 H17"/><path d="M5.2 9.5 H18.8"/><path d="M5.2 14.5 H18.8"/>` },
  { id: "🌾", name: "麦／穀物", cat: "リソース", pro: true,
    svg: `<path d="M12 20 V7.3"/>${d(12,5.8,1.35)}${d(9.6,8.2,1.35)}${d(14.4,8.2,1.35)}${d(9.6,11.3,1.35)}${d(14.4,11.3,1.35)}${d(9.6,14.4,1.35)}${d(14.4,14.4,1.35)}` },
  { id: "🍖", name: "食料／食事", cat: "リソース", pro: true,
    svg: `<path d="M6.5 4 V8.3 C6.5 9.8 8.5 10 8.5 10 C8.5 10 10.5 9.8 10.5 8.3 V4"/><path d="M8.5 10 V20"/><path d="M16.5 4 C17.9 6 17.9 10.5 16.5 12.5 Z"/><path d="M16.5 12.5 V20"/>` },
  { id: "🌲", name: "木／森", cat: "リソース", pro: true,
    svg: `<path d="M12 4 L7.5 11 H9.8 L6.5 16.5 H17.5 L14.2 11 H16.5 Z"/><path d="M12 16.5 V20"/>` },
  { id: "🪨", name: "石／鉱石", cat: "リソース", pro: true,
    svg: `<path d="M4.5 15.5 L8 8 L14 6 L19.5 12 L17 17.5 Z"/><path d="M8 8 L12 12 L19.5 12"/><path d="M12 12 L11 17.5"/>` },
  { id: "🟫", name: "茶／粘土", cat: "リソース", pro: true, color: "#9c6b45" },
  { id: "🟣", name: "紫トークン", cat: "リソース", pro: true, color: "#9256b0" },
  { id: "🟠", name: "橙トークン", cat: "リソース", pro: true, color: "#df8a3e" },

  // ============ コマ・進行 ============
  { id: "worker", name: "コマ／ワーカー", cat: "コマ・進行", pro: false,
    svg: `<path d="M12 3.3c1.4 0 2.5 1.1 2.5 2.5 0 1-.6 1.9-1.5 2.3 2 .3 3.4.8 4.6 1.6 1 .7 1.4 1.5 1.4 2.6 0 .8-.5 1.3-1.4 1.3-1.2 0-2.2-.3-3.4-.6.3 1.7.4 3.5.4 5.4 0 .8-.5 1.2-1.4 1.2H12h-1.2c-.9 0-1.4-.4-1.4-1.2 0-1.9.1-3.7.4-5.4-1.2.3-2.2.6-3.4.6-.9 0-1.4-.5-1.4-1.3 0-1.1.4-1.9 1.4-2.6 1.2-.8 2.6-1.3 4.6-1.6-.9-.4-1.5-1.3-1.5-2.3 0-1.4 1.1-2.5 2.5-2.5z"/>` },
  { id: "move", name: "移動", cat: "コマ・進行", pro: false,
    svg: `<ellipse cx="9" cy="15" rx="2.1" ry="3"/><ellipse cx="15" cy="9" rx="2.1" ry="3"/>` },
  { id: "flag", name: "ゲーム終了／最終", cat: "コマ・進行", pro: false,
    svg: `<path d="M6.5 4 V20.5"/><path d="M6.5 5 H17 L14 8.2 L17 11.4 H6.5"/>` },
  { id: "track", name: "スコアトラック／進む", cat: "コマ・進行", pro: true,
    svg: `<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M7.5 10 V14"/><path d="M12 10 V14"/><path d="M16.5 10 V14"/><rect x="13" y="7.5" width="5" height="9" rx="1.2"/>` },
  { id: "🚂", name: "列車／乗り物", cat: "コマ・進行", pro: true,
    svg: `<path d="M4 16 V8 H11 V11 H18.5 V16 Z"/><path d="M14.5 11 V7 H17.5 V11"/><rect x="6" y="10" width="3.4" height="3.4" rx="0.6"/><circle cx="8" cy="18" r="1.7"/><circle cx="16" cy="18" r="1.7"/>` },
  { id: "🗺️", name: "ボード／マップ", cat: "コマ・進行", pro: true,
    svg: `<path d="M4 6.5 L9.5 8.5 L14.5 6.5 L20 8.5 V17.5 L14.5 15.5 L9.5 17.5 L4 15.5 Z"/><path d="M9.5 8.5 V17.5"/><path d="M14.5 6.5 V15.5"/>` },
  { id: "🚩", name: "陣地／自分の場所", cat: "コマ・進行", pro: true,
    svg: `<path d="M7.5 19 V4"/><path d="M7.5 5 H17 V10.5 H7.5"/><path d="M4.5 19 Q8 21 11.5 19"/>` },

  // ============ アクション ============
  { id: "get", name: "得る／増える", cat: "アクション", pro: false,
    svg: `<circle cx="12" cy="12" r="8"/><path d="M12 8.5 V15.5"/><path d="M8.5 12 H15.5"/>` },
  { id: "pay", name: "支払う／減る", cat: "アクション", pro: false,
    svg: `<circle cx="12" cy="12" r="8"/><path d="M8.5 12 H15.5"/>` },
  { id: "exchange", name: "交換／リロール", cat: "アクション", pro: false,
    svg: `<path d="M6.5 9 H15"/><path d="M12.4 6.4 L15.4 9 L12.4 11.6"/><path d="M17.5 15 H9"/><path d="M11.6 12.4 L8.6 15 L11.6 17.6"/>` },
  { id: "gear", name: "エンジン／歯車", cat: "アクション", pro: true,
    svg: `<circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.7"/><path d="M12 7 V4.5"/><path d="M12 17 V19.5"/><path d="M16.3 9.5 L18.5 8.3"/><path d="M7.7 9.5 L5.5 8.3"/><path d="M7.7 14.5 L5.5 15.7"/><path d="M16.3 14.5 L18.5 15.7"/>` },
  { id: "gavel", name: "競り／入札", cat: "アクション", pro: true,
    svg: `<path d="M17.9 9.85 L15.35 12.4 L11.1 8.15 L13.65 5.6 Z"/><path d="M13.2 10.3 L7.5 16"/><path d="M4.5 19.5 H11.5"/>` },
  { id: "⚔️", name: "戦闘／攻撃", cat: "アクション", pro: true,
    svg: `<path d="M16.8 7.2 L6.6 17.4"/><path d="M7.2 7.2 L17.4 17.4"/><path d="M8.4 12.6 L11.4 15.6"/><path d="M12.6 15.6 L15.6 12.6"/>${d(6.2,17.8,1.2)}${d(17.8,17.8,1.2)}` },
  { id: "🛡️", name: "防御", cat: "アクション", pro: true,
    svg: `<path d="M12 4 L19 6.5 V12 C19 16.6 15.8 19.2 12 20.5 C8.2 19.2 5 16.6 5 12 V6.5 Z"/>` },
  { id: "🎯", name: "指定／狙う", cat: "アクション", pro: true,
    svg: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.3"/>${d(12,12,1.6)}` },
  { id: "🤝", name: "交渉／取引", cat: "アクション", pro: true,
    svg: `<path d="M3.5 18.5 L9 14.3 L11 15.6 L13 14 L15 15.3 L20.5 18.5"/>` },

  // ============ 得点・特殊 ============
  { id: "vp", name: "勝利点（星）", cat: "得点・特殊", pro: false,
    svg: `<path d="M12 3.8 L13.94 9.33 L19.8 9.47 L15.14 13.02 L16.82 18.63 L12 15.3 L7.18 18.63 L8.86 13.02 L4.2 9.47 L10.06 9.33 Z"/>` },
  { id: "life", name: "ライフ／体力", cat: "得点・特殊", pro: false,
    svg: `<path d="M12 20 C6 15.5 4 12 4 8.9 C4 6.5 5.9 5 7.9 5 C9.5 5 11.1 6.1 12 7.7 C12.9 6.1 14.5 5 16.1 5 C18.1 5 20 6.5 20 8.9 C20 12 18 15.5 12 20 Z"/>` },
  { id: "house", name: "建てる／建物", cat: "得点・特殊", pro: false,
    svg: `<path d="M4.5 11 L12 4.5 L19.5 11"/><path d="M6.5 9.6 V19.5 H17.5 V9.6"/>` },
  { id: "castle", name: "城／砦", cat: "得点・特殊", pro: true,
    svg: `<path d="M6.5 20 V8 H8.5 V6 H10.5 V8 H13.5 V6 H15.5 V8 H17.5 V20"/><path d="M5 20 H19"/><path d="M10 20 V15 A2 2 0 0 1 14 15 V20"/>` },
  { id: "ticket", name: "目的地チケット", cat: "得点・特殊", pro: true,
    svg: `<rect x="3.5" y="7" width="17" height="10" rx="1.8"/><path d="M9.2 12 H14.8"/>${d(8,12,1.6)}${d(16,12,1.6)}` },
  { id: "clock", name: "時間／ラウンド", cat: "得点・特殊", pro: true,
    svg: `<circle cx="12" cy="12" r="8"/><path d="M12 7.5 V12 L15.3 13.8"/>` },
  { id: "🔮", name: "特殊効果", cat: "得点・特殊", pro: true,
    svg: `<path d="M12 3.5 L13.6 10.4 L20.5 12 L13.6 13.6 L12 20.5 L10.4 13.6 L3.5 12 L10.4 10.4 Z"/>${d(18.6,6,1)}${d(5.6,17,1)}` },
  { id: "👑", name: "リーダー／親", cat: "得点・特殊", pro: true,
    svg: `<path d="M5 17 L6.4 8.5 L10 13 L12 6.8 L14 13 L17.6 8.5 L19 17 Z"/><path d="M5 17 H19"/>` },
  { id: "💥", name: "脱落／破壊", cat: "得点・特殊", pro: true,
    svg: `<path d="M12 3 L14.5 7.7 L19.8 7.5 L17 12 L19.8 16.5 L14.5 16.3 L12 21 L9.5 16.3 L4.2 16.5 L7 12 L4.2 7.5 L9.5 7.7 Z"/>` },
];

// id → エントリ の索引（描画・後方互換に使う）
export const ICON_BY_ID = Object.fromEntries(ICON_LIBRARY.map((i) => [i.id, i]));

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
