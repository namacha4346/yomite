import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { DIAGNOSIS } from "./tags.js";
import { likeCount } from "../social/likes.js";

// ゲーム図鑑（台本のメタ＋診断タグをマージ）。
// サンプルの架空ゲームは診断のおすすめには出さない。
const GAMES = SAMPLE_SCRIPTS.filter((s) => s.id !== "sample-script-1").map(
  (s) => ({ ...s, ...(DIAGNOSIS[s.id] || {}) })
);

// 満点＝各軸の最大の合計：人数2＋時間2＋気分4＋重さ2＋場2＋攻撃2
export const MAX_SCORE = 14;

// 回答した質問ぶんの満点（スキップした軸は数えない）。
// ぴったり度% を「答えた内容に対する一致度」にするために使う。
export function maxScore(a) {
  let m = 0;
  if (a.players != null) m += 2;
  if (a.time) m += 2;
  if (a.mood) m += 4;
  if (a.weight != null) m += 2;
  if (a.scene) m += 2;
  if (a.conflict) m += 2;
  return m || 1; // 全スキップ時の0除算回避
}

// ゲームの所要時間（分）を short / mid / long のバケツに変換。
// 質問の答えも short/mid/long なので、これで型を揃える（以前は数値と文字を
// 比較していて永久に一致しなかった＝時間が効いていなかった）。
function timeBucket(min) {
  if (min == null) return null;
  if (min <= 15) return "short";
  if (min <= 30) return "mid";
  return "long";
}
const TIME_ORDER = ["short", "mid", "long"];
function timeScore(gBucket, aBucket) {
  if (!aBucket || !gBucket) return 0;
  if (gBucket === aBucket) return 2;
  // 1段ずれ（短⇔中、中⇔長）は +1、2段ずれ（短⇔長）は 0
  return Math.abs(TIME_ORDER.indexOf(gBucket) - TIME_ORDER.indexOf(aBucket)) === 1
    ? 1
    : 0;
}

// 回答（answers）に対する1ゲームの相性スコア。
// スキップ(null)はその軸を無視（加点も減点もしない）。
function scoreGame(g, a) {
  let s = 0;

  // 人数：選んだ人数で遊べれば +2、遊べないなら −3（実質フィルタ）。
  if (a.players != null && g.players) {
    const ok = g.players.min <= a.players && a.players <= g.players.max;
    s += ok ? 2 : -3;
  }

  // 時間：数値をバケツ化してから比較。ぴったり +2 / 1段ずれ +1。
  s += timeScore(timeBucket(g.time), a.time);

  // 気分：このゲームで一番大事にしたい軸。一致で +4。
  if (a.mood && g.moods && g.moods.includes(a.mood)) s += 4;

  // 重さ：同じ +2 / 1違い +1 / 2違い −1（かんたん希望なのに重い等は減点）。
  if (a.weight != null && g.weight != null) {
    const d = Math.abs(g.weight - a.weight);
    s += d === 0 ? 2 : d === 1 ? 1 : -1;
  }

  // 場：合えば +2（複数タグのどれかに該当でOK）。
  if (a.scene && g.scenes && g.scenes.includes(a.scene)) s += 2;

  // 直接攻撃：一致で +2 / 逆なら −2（平和希望なのに蹴落とし系は減点）。
  if (a.conflict && g.conflict) {
    s += g.conflict === a.conflict ? 2 : -2;
  }

  return s;
}

// 合う順に並べて返す。同点は「人気（いいね）が多い順」→ タイトル順。
export function recommend(answers) {
  return GAMES.map((g) => ({ game: g, score: scoreGame(g, answers) })).sort(
    (x, y) =>
      y.score - x.score ||
      likeCount(y.game.id) - likeCount(x.game.id) ||
      x.game.gameTitle.localeCompare(y.game.gameTitle)
  );
}
