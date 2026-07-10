import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QUESTIONS } from "../discover/quiz.js";
import { recommend, maxScore } from "../discover/match.js";
import { GameArt, Icon } from "../ui/graphics.jsx";

// 紹介文の末尾にある「2〜4人・約30分」などのメタ表記を取り除く
// （人数・時間はチップで別に表示しているため重複を避ける）。
function stripMeta(about) {
  return about
    .replace(/[0-9０-９]+[〜～][0-9０-９]+人[^。]*。?\s*$/, "")
    .trim();
}

// 認知のハードル：ぴったり診断 → おすすめゲームの概要。
export default function Discover() {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length（=結果）
  const [answers, setAnswers] = useState({});

  // 質問が進む／結果に切り替わるたびに一番上へ。
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const answer = (key, value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const done = step >= QUESTIONS.length;

  return (
    <div className="page page--discover">
      <span className="page-hurdle">認知のハードル</span>
      <h1 className="page-title">出会う</h1>
      <p className="page-lead">
        いくつかの質問に答えると、あなたに合いそうなゲームが見つかる「ぴったり診断」。
      </p>

      {!done ? (
        <Quiz
          step={step}
          answers={answers}
          onAnswer={answer}
          onBack={back}
        />
      ) : (
        <Results answers={answers} onRestart={restart} />
      )}

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}

function Quiz({ step, answers, onAnswer, onBack }) {
  const q = QUESTIONS[step];
  return (
    <div className="quiz">
      <div className="quiz-progress">
        質問 {step + 1} / {QUESTIONS.length}
      </div>
      <h2 className="quiz-q">{q.q}</h2>
      <div className="quiz-opts">
        {q.opts.map(([label, value]) => (
          <button
            key={label}
            type="button"
            className={"quiz-opt" + (answers[q.key] === value ? " is-on" : "")}
            onClick={() => onAnswer(q.key, value)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="quiz-skip"
          onClick={() => onAnswer(q.key, null)}
        >
          どれでもOK（スキップ）
        </button>
      </div>
      {step > 0 && (
        <button type="button" className="linkbtn quiz-back" onClick={onBack}>
          ← 前の質問へ
        </button>
      )}
    </div>
  );
}

function Results({ answers, onRestart }) {
  const ranked = recommend(answers).filter((r) => r.score > 0);
  const top = ranked[0];
  const rest = ranked.slice(1, 3);

  if (!top) {
    return (
      <div className="results">
        <p className="hint">条件に合うゲームが見つかりませんでした。</p>
        <button type="button" className="savebtn" onClick={onRestart}>
          もう一度診断する
        </button>
      </div>
    );
  }

  const pct = Math.round((Math.max(0, top.score) / maxScore(answers)) * 100);

  return (
    <div className="results">
      <p className="results-lead">あなたにぴったりなのは…</p>
      <GameOverview item={top} pct={pct} big />

      {rest.length > 0 && (
        <>
          <h3 className="results-h">次点のおすすめ</h3>
          {rest.map((r) => (
            <GameOverview key={r.game.id} item={r} />
          ))}
        </>
      )}

      <button type="button" className="savebtn results-again" onClick={onRestart}>
        もう一度診断する
      </button>
    </div>
  );
}

function GameOverview({ item, pct, big }) {
  const g = item.game;
  return (
    <article className={"overview" + (big ? " overview--big" : "")}>
      <div className="overview-head">
        <GameArt game={g} className="overview-cover" />
        <div className="overview-title-wrap">
          <h3 className="overview-title">{g.gameTitle}</h3>
          <p className="overview-meta">
            {g.players && (
              <span className="mini-chip">
                <Icon name="users" />
                {g.players.min}–{g.players.max}
              </span>
            )}
            {g.time && (
              <span className="mini-chip">
                <Icon name="clock" />
                {g.time}分
              </span>
            )}
          </p>
          {big && pct != null && (
            <span className="overview-fit">ぴったり度 {pct}%</span>
          )}
        </div>
      </div>

      {g.about && <p className="overview-about">{stripMeta(g.about)}</p>}

      {g.mechanics && g.mechanics.length > 0 && (
        <div className="overview-tags">
          {g.mechanics.map((m) => (
            <span key={m} className="overview-tag">{m}</span>
          ))}
        </div>
      )}

      <Link to={`/game/${g.id}`} className="overview-cta">
        くわしく見る
        <Icon name="arrow" />
      </Link>
    </article>
  );
}
