// 運営が作る「公式サマリー」の見本（＝コンテンツ初期投入＆品質の基準）。
// 完全オリジナル（自作アイコン＝絵文字＋自分の言葉）なので他社IPを含まない。
// official:true のものは、将来フリーミアムで有料にし得る"きれいに売れる"コンテンツ。

export const SAMPLE_SUMMARIES = [
  {
    id: "sample-1",
    official: true,
    gameTitle: "サンプル：やさしい農場ゲーム（架空）",
    turnActions: [
      "手番でできることは1つだけ選ぶ",
      "🌾 畑から食料をとる",
      "🏠 建物を1つ建てる（🪙を支払う）",
      "🃏 カードを1枚引く",
    ],
    icons: [
      { icon: "🌾", meaning: "食料。人を養うのに使う" },
      { icon: "🪙", meaning: "お金。建てるときに支払う" },
      { icon: "🏠", meaning: "建物。建てると⭐が増える" },
      { icon: "⭐", meaning: "勝利点。多い人が勝ち" },
    ],
    endCondition: "山札がなくなったラウンドで終了。⭐が一番多い人の勝ち。",
  },
  {
    id: "sample-2",
    official: true,
    gameTitle: "サンプル：はじめての対戦カード（架空）",
    turnActions: [
      "① ✋手札から1枚出す",
      "② ⚔️攻撃するか 🛡️守るか を決める",
      "③ 🃏山札から1枚補充する",
    ],
    icons: [
      { icon: "⚔️", meaning: "攻撃。相手の❤️を1減らす" },
      { icon: "🛡️", meaning: "防御。次の攻撃を1回防ぐ" },
      { icon: "❤️", meaning: "ライフ。0になったら負け" },
    ],
    endCondition: "どちらかの❤️が0になったら終了。残った人の勝ち。",
  },
];
