// ボードゲームの表紙（カバー）の色を、そのゲームのメカニクスから決める。
// ・メカニクスごとに1色を割り当てる（下の MECH_COLOR）。
// ・複数のメカニクスを持つゲームは、その色を混ぜた中間色にする。
// これで新しいゲームを増やしても、色が枯渇せず・意味づけのある配色になる。

// メカニクス → 基本色。華やかさ（彩度）を上げつつ、白文字がのる帯でも読める
// 中間の明るさにそろえてある。複数該当は平均して中間色にする。
export const MECH_COLOR = {
  ワカプレ: "#2f6fc9",          // 青
  デッキ構築: "#1f9560",        // 緑
  エンジンビルド: "#a5652b",    // キャラメル茶
  セットコレクション: "#7a4fca", // 紫
  エリアマジョリティ: "#6f8f2f", // オリーブ緑
  タイル配置: "#cf6237",        // テラコッタ
  競り: "#c0901c",              // ゴールド
  ドラフト: "#1aa094",          // ティール
  トリックテイキング: "#4a5bd0", // 藍
  ダイス: "#d64435",            // 赤
  正体隠匿: "#9b3f86",          // ワイン
  協力: "#1fa070",             // エメラルド
  ブラフ: "#c93f86",           // マゼンタ
  バッティング: "#db8225",      // オレンジ
  推理: "#3560c0",             // 紺
  記憶: "#db5488",             // ピンク
  スピード: "#e0603c",         // 朱
  コミュニケーション: "#2f9fce", // シアン
};

const FALLBACK = "#8a7f6c";

function hexToRgb(h) {
  const n = parseInt(String(h).replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

// ゲームの表紙色を返す。メカニクスの色を平均した中間色。
// メカニクスが無い（ユーザー投稿など）場合は、その台本の color か中立色。
export function gameColor(game) {
  const mechs = (game && game.mechanics) || [];
  const rgbs = mechs.map((m) => MECH_COLOR[m]).filter(Boolean).map(hexToRgb);
  if (rgbs.length === 0) return (game && game.color) || FALLBACK;
  const sum = rgbs.reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0]);
  return rgbToHex([sum[0] / rgbs.length, sum[1] / rgbs.length, sum[2] / rgbs.length]);
}
