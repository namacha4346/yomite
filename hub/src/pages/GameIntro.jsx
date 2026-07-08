import { Link, useParams } from "react-router-dom";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { INTRO, DIFFICULTY_LABEL } from "../discover/intro.js";

// 初心者向けのゲーム紹介ページ。/game/:id
// 「どんなゲームか」を、ルールを読む前に把握できる。
export default function GameIntro() {
  const { id } = useParams();
  const game = SAMPLE_SCRIPTS.find((s) => s.id === id);
  const intro = INTRO[id] || {};

  if (!game) {
    return (
      <div className="page page--discover">
        <h1 className="page-title">ゲームが見つかりません</h1>
        <Link to="/discover" className="page-back">← 診断にもどる</Link>
      </div>
    );
  }

  return (
    <div className="page page--discover">
      <Link to="/discover" className="page-back gi-back">← 診断にもどる</Link>

      {/* ヒーロー */}
      <div className="gi-hero">
        <span
          className="gi-cover"
          style={{ background: game.color || "#8a7f6c" }}
          aria-hidden="true"
        >
          {game.coverEmoji || "🎲"}
        </span>
        <h1 className="gi-title">{game.gameTitle}</h1>
        {intro.catch && <p className="gi-catch">{intro.catch}</p>}
        <div className="gi-meta">
          {game.players && (
            <span className="gi-chip">👥 {game.players.min}–{game.players.max}人</span>
          )}
          {game.time && <span className="gi-chip">⏱ {game.time}分</span>}
          {intro.difficulty && (
            <span className="gi-chip">🎯 {DIFFICULTY_LABEL[intro.difficulty]}</span>
          )}
        </div>
        {game.mechanics && game.mechanics.length > 0 && (
          <div className="gi-tags">
            {game.mechanics.map((m) => (
              <span key={m} className="overview-tag">{m}</span>
            ))}
          </div>
        )}
      </div>

      {/* どんなゲーム？ */}
      {intro.vibe && (
        <section className="gi-sec">
          <h2 className="gi-h">どんなゲーム？</h2>
          <p className="gi-text">{intro.vibe}</p>
        </section>
      )}

      {/* こんな人におすすめ */}
      {intro.forWho && intro.forWho.length > 0 && (
        <section className="gi-sec">
          <h2 className="gi-h">こんな人におすすめ</h2>
          <ul className="gi-list">
            {intro.forWho.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 遊びどころ */}
      {intro.points && intro.points.length > 0 && (
        <section className="gi-sec">
          <h2 className="gi-h">遊びどころ</h2>
          <ul className="gi-list gi-points">
            {intro.points.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 次のステップ：ルールを見る（教わる） */}
      <div className="gi-cta-row">
        <Link to="/learn" className="savebtn gi-cta">
          遊びたくなったら → ルールを見る（教わる）
        </Link>
        <Link to="/discover" className="gi-cta-sub">
          もう一度診断する
        </Link>
      </div>
    </div>
  );
}
