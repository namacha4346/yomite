// カタログのゲームタイル（表紙＋タイトル＋人数・時間）。
// 表紙は cover（画像URL）があれば写真、なければ color＋絵文字のプレースホルダー。
export default function GameTile({ script, onOpen }) {
  const { gameTitle, players, time, color, coverEmoji, cover, official, mechanics } =
    script;
  const genre = mechanics && mechanics[0];

  return (
    <button className="tile" type="button" onClick={() => onOpen(script.id)}>
      <span className="tile-cover" style={{ background: color || "#8a7f6c" }}>
        {cover ? (
          <img className="tile-img" src={cover} alt="" />
        ) : (
          <span className="tile-emoji" aria-hidden="true">
            {coverEmoji || "🎲"}
          </span>
        )}
        {official && <span className="tile-official">公式</span>}
      </span>

      <span className="tile-body">
        <span className="tile-title">{gameTitle || "（無題）"}</span>
        <span className="tile-meta">
          {players && (
            <span className="tile-chip">👥 {players.min}–{players.max}人</span>
          )}
          {time && <span className="tile-chip">⏱ {time}分</span>}
        </span>
        {genre && <span className="tile-genre">{genre}</span>}
      </span>
    </button>
  );
}
