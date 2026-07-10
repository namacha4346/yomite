// ゲームを「買う・さがす」ための外部リンク。
// 当サイトはインストの"補助"であって"代替"ではない、という姿勢を示すための導線。
// いまは外部の検索に飛ばすだけ。将来は正規取扱店・出版社・アフィリエイトに差し替え可能。
export function buyUrl(title) {
  // タイトル末尾の英名（括弧）を落として検索語にする
  const q = (title || "").replace(/（.*?）|\(.*?\)/g, "").trim() || title || "";
  return "https://www.amazon.co.jp/s?k=" + encodeURIComponent("ボードゲーム " + q);
}
