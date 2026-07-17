import { GameArt, Icon } from "../ui/graphics.jsx";
import { INTRO, DIFFICULTY_LABEL } from "../discover/intro.js";

// カタログのゲームカード（アートサムネイル＋タイトル＋チップ）。
// 絵文字は使わず、統一SVGアイコンで表現する。
// count = そのゲームにある台本の本数。
export default function GameTile({ script, onOpen, count }) {
  const { gameTitle, players, time, mechanics } = script;
  const genre = mechanics && mechanics[0];
  const intro = INTRO[script.id];
  const scene = intro && intro.forWho && intro.forWho[0];
  const difficulty = intro && intro.difficulty;

  return (
    <button className="tile" type="button" onClick={() => onOpen()}>
      <span className="tile-cover">
        <GameArt game={script} />
        {count > 1 && <span className="tile-count">台本 {count}本</span>}
      </span>

      <span className="tile-body">
        <span className="tile-title">{gameTitle || "（無題）"}</span>

        <span className="tile-chips">
          {players && (
            <span className="mini-chip">
              <Icon name="users" />
              {players.min}–{players.max}
            </span>
          )}
          {time && (
            <span className="mini-chip">
              <Icon name="clock" />
              {time}分
            </span>
          )}
          {difficulty && (
            <span className="mini-chip">
              <Icon name="gauge" />
              {DIFFICULTY_LABEL[difficulty]}
            </span>
          )}
        </span>

        <span className="tile-foot">
          {genre && <span className="tile-genre">{genre}</span>}
        </span>

        {scene && <span className="tile-scene">こんな時に：{scene}</span>}
      </span>
    </button>
  );
}
