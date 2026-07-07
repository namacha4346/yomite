// 台本（インスト本文）のセクション定義。全10項目・全部必須（一言でもOK）。
// type: text=長文, list=箇条書き（手番）, icons=アイコン早見表
// summary: そのセクションがサマリー（早見表）に再利用されるか
export const SECTIONS = [
  { key: "about", no: "①", label: "どんなゲーム？（目的）", type: "text",
    ph: "例：カードを集めて自分の農場を育てるゲーム。一番の農場を目指す。" },
  { key: "win", no: "②", label: "勝利条件", type: "text",
    ph: "例：ゲーム終了時に勝利点が一番多い人が勝ち。" },
  { key: "setup", no: "③", label: "準備", type: "text",
    ph: "例：各自にカード5枚とコマ3個を配る。山札を中央に置く。" },
  { key: "flow", no: "④", label: "ゲームの流れ", type: "text",
    ph: "例：手番は時計回り。全員が3回手番をしたら1ラウンド終了。" },
  { key: "turn", no: "⑤", label: "手番でできること", type: "list",
    ph: "例：🌾 畑から食料をとる" },
  { key: "scoring", no: "⑥", label: "得点の入り方", type: "text",
    ph: "例：建物1つにつき⭐1点。（軽いゲームは「特になし」でもOK）" },
  { key: "end", no: "⑦", label: "終了条件", type: "text",
    ph: "例：山札がなくなったラウンドで終了。" },
  { key: "icons", no: "⑧", label: "アイコン早見表", type: "icons",
    ph: "" },
  { key: "special", no: "⑨", label: "特殊ルール・例外", type: "text",
    ph: "例：特になし。／手札上限は10枚まで。" },
  { key: "pitfalls", no: "⑩", label: "よくある勘違い", type: "text",
    ph: "例：手番でできるのは1つだけ（まとめて2つはできない）。" },
];

// サマリー（早見表）に使うセクション
export const SUMMARY_KEYS = { turn: "turn", end: "end", icons: "icons" };
