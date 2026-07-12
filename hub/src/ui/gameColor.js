// ボードゲームの表紙（カバー）の色を、そのゲームのメカニクスから決める。
// ・メカニクスごとに1色を割り当てる（下の MECH_COLOR）。
// ・複数のメカニクスを持つゲームは、その色を混ぜた中間色にする。
// これで新しいゲームを増やしても、色が枯渇せず・意味づけのある配色になる。

// メカニクス → 基本色（中間トーンでそろえ、混色しても濁りにくいようにしている）
export const MECH_COLOR = {
  ワカプレ: "#3f6cae",          // 青
  デッキ構築: "#3f8f6b",        // 緑
  エンジンビルド: "#9a6a41",    // 茶
  セットコレクション: "#6d5aa0", // 紫
  エリアマジョリティ: "#6f8a3f", // オリーブ
  タイル配置: "#b3663f",        // テラコッタ
  競り: "#b58a34",              // 黄土（ゴールド）
  ドラフト: "#3f9a90",          // ティール
  トリックテイキング: "#4b57a0", // 藍
  ダイス: "#b0503f",            // 赤
  正体隠匿: "#7a3f6e",          // ワイン
  協力: "#3f9a78",             // エメラルド
  ブラフ: "#a8497a",           // マゼンタ
  バッティング: "#c07a3a",      // オレンジ
  推理: "#3f5f8f",             // 紺
  記憶: "#c06a8a",             // ピンク
  スピード: "#cf6b45",         // 朱
  コミュニケーション: "#3f95b5", // シアン
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
