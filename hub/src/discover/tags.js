// 診断用のゲームタグ（気分・重さ・場・直接攻撃）。
// ゲーム本体は script/samples.js（人数・時間・システム・紹介文を既に持つ）。
// ここは id で紐づけて、診断の6軸のうち "気分/重さ/場/攻撃" を補う。
// moods: party(ワイワイ)/strategy(戦略)/coop(協力)/bluff(心理戦)
// weight: 1(かんたん)〜3(しっかり)  scenes: adult/family/drink  conflict: attack/peace
export const DIAGNOSIS = {
  splendor: { moods: ["strategy"], weight: 2, scenes: ["adult", "family"], conflict: "peace" },
  dominion: { moods: ["strategy"], weight: 2, scenes: ["adult"], conflict: "peace" },
  carcassonne: { moods: ["strategy"], weight: 1, scenes: ["family", "adult"], conflict: "attack" },
  "stone-age": { moods: ["strategy"], weight: 3, scenes: ["adult", "family"], conflict: "attack" },
  "ticket-to-ride": { moods: ["strategy", "party"], weight: 1, scenes: ["family", "adult"], conflict: "attack" },
  "sample-script-1": { moods: ["party"], weight: 1, scenes: ["family"], conflict: "peace" },
};
