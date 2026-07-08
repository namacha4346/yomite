import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { DIAGNOSIS } from "./tags.js";

// ゲーム図鑑（台本のメタ＋診断タグをマージ）
const GAMES = SAMPLE_SCRIPTS.map((s) => ({ ...s, ...(DIAGNOSIS[s.id] || {}) }));

export const MAX_SCORE = 14; // 3+2+3+2+2+2

const TIME_ORDER = ["short", "mid", "long"];
function timeScore(gt, at) {
  if (!at || !gt) return 0;
  if (gt === at) return 2;
  return Math.abs(TIME_ORDER.indexOf(gt) - TIME_ORDER.indexOf(at)) === 1 ? 1 : 0;
}

// 回答（answers）に対する1ゲームの相性スコア。スキップ(null)は加点0（減点なし）。
function scoreGame(g, a) {
  let s = 0;
  if (a.players != null && g.players) {
    if (g.players.min <= a.players && a.players <= g.players.max) s += 3;
  }
  s += timeScore(g.time, a.time);
  if (a.mood && g.moods && g.moods.includes(a.mood)) s += 3;
  if (a.weight != null && g.weight != null) {
    const d = Math.abs(g.weight - a.weight);
    s += d === 0 ? 2 : d === 1 ? 1 : 0;
  }
  if (a.scene && g.scenes && g.scenes.includes(a.scene)) s += 2;
  if (a.conflict && g.conflict && g.conflict === a.conflict) s += 2;
  return s;
}

// 合う順に並べて返す（同点はタイトル順）
export function recommend(answers) {
  return GAMES.map((g) => ({ game: g, score: scoreGame(g, answers) })).sort(
    (x, y) =>
      y.score - x.score || x.game.gameTitle.localeCompare(y.game.gameTitle)
  );
}
