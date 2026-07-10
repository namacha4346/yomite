// 診断用のゲームタグ（気分・重さ・場・直接攻撃）。
// ゲーム本体は script/samples.js（人数・時間・システム・紹介文を既に持つ）。
// ここは id で紐づけて、診断の6軸のうち "気分/重さ/場/攻撃" を補う。
//
// moods: party(ワイワイ)/strategy(戦略)/coop(協力)/bluff(心理戦)  ※複数可
// weight: 1(かんたん)〜3(しっかり)   scenes: adult/family/drink   conflict: attack/peace
//
// conflict の目安：
//   attack = 相手を直接脱落・妨害・押し付ける「テイクダウン系」
//   peace  = 直接攻撃はなく、資源やスペースを競う「早い者勝ち/読み合い系」
export const DIAGNOSIS = {
  // 拡大再生産の定番。運より戦略、直接攻撃なしの純レース。
  splendor: { moods: ["strategy"], weight: 2, scenes: ["adult", "family"], conflict: "peace" },
  // デッキ構築の元祖。思考量やや多め＝大人向き。基本は非攻撃的。
  dominion: { moods: ["strategy"], weight: 2, scenes: ["adult"], conflict: "peace" },
  // タイルを並べて街づくり。軽くて家族向き。競り合いはあるが穏やか。
  carcassonne: { moods: ["strategy"], weight: 1, scenes: ["family", "adult"], conflict: "peace" },
  // ワカプレの中量級。この中では一番しっかり。妨害は場所取り程度で穏やか。
  "stone-age": { moods: ["strategy"], weight: 3, scenes: ["adult", "family"], conflict: "peace" },
  // 路線をつなぐ定番。軽くてワイワイ。路線の取り合い＝軽い妨害あり。
  "ticket-to-ride": { moods: ["strategy", "party"], weight: 1, scenes: ["family", "adult"], conflict: "attack" },
  // 記憶＆早取りのパーティ。子ども〜お酒の席まで。攻撃なし。
  nanjamonja: { moods: ["party"], weight: 1, scenes: ["family", "drink"], conflict: "peace" },
  // 唯一の協力ゲー。会話で盛り上がる。大人数・非攻撃。
  ito: { moods: ["coop", "party"], weight: 1, scenes: ["drink", "adult", "family"], conflict: "peace" },
  // 手札1枚の脱落系心理戦。相手を落とす＝直接攻撃あり。
  "love-letter": { moods: ["bluff", "party"], weight: 1, scenes: ["adult", "drink"], conflict: "attack" },
  // ウソを見破る押し付け合い。負けを相手に回す＝直接攻撃あり。
  "cockroach-poker": { moods: ["bluff", "party"], weight: 1, scenes: ["family", "drink"], conflict: "attack" },
  // せり＆読み合い。相手は落とさない競争なので穏やか寄り。
  vulture: { moods: ["bluff", "party"], weight: 1, scenes: ["family", "adult"], conflict: "peace" },
  // サンプル（診断のおすすめには出さない）
  "sample-script-1": { moods: ["party"], weight: 1, scenes: ["family"], conflict: "peace" },
};
