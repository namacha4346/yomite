import { Link } from "react-router-dom";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { GameArt, Icon } from "../ui/graphics.jsx";

// トップ画面：コンセプト一言 ＋ 3つの入口（扉）＋ 注目のゲーム。
// 3つのハードル（インスト・場所・認知）にそれぞれ対応している。
const DOORS = [
  {
    to: "/learn",
    label: "教わる／教える",
    hurdle: "インストのハードル",
    desc: "ルール説明を、初心者でもできるように。",
    key: "learn",
    icon: "book",
  },
  {
    to: "/discover",
    label: "出会う",
    hurdle: "認知のハードル",
    desc: "自分に合う一作と出会う、はじめの一歩。",
    key: "discover",
    icon: "compass",
  },
  {
    to: "/place",
    label: "集まる",
    hurdle: "場所のハードル",
    desc: "近くの卓・お店を見つけて、遊ぶ場所へ。",
    key: "place",
    icon: "pin",
    soon: true,
  },
];

// 注目のゲーム（実在の公式台本から数本／サンプルは除く）
const FEATURED = SAMPLE_SCRIPTS.filter((s) => s.id !== "sample-script-1").slice(0, 6);

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">
          遊びたい気持ちを、<br />
          遊べるに変える。
        </h1>
        <p className="hero-sub">
          ボードゲームの「教える・集まる・出会う」を、少しずつやさしく。
        </p>
        <div className="hero-cta">
          <Link to="/discover" className="btn btn--primary hero-cta-btn">
            はじめての人は「ぴったり診断」から
            <Icon name="arrow" />
          </Link>
        </div>
      </section>

      <nav className="doors" aria-label="3つの入口">
        {DOORS.map((d) => (
          <Link
            key={d.key}
            to={d.to}
            className={`door door--${d.key}` + (d.soon ? " door--soon" : "")}
          >
            <span className="door-icon" aria-hidden="true">
              <Icon name={d.icon} />
            </span>
            <span className="door-body">
              <span className="door-hurdle">{d.hurdle}</span>
              <span className="door-label">
                {d.label}
                {d.soon && <span className="door-soon">近日公開</span>}
              </span>
              <span className="door-desc">{d.desc}</span>
            </span>
            <span className="door-arrow" aria-hidden="true">
              <Icon name="arrow" />
            </span>
          </Link>
        ))}
      </nav>

      <section className="feat">
        <div className="feat-head">
          <h2 className="feat-title">注目のゲーム</h2>
          <Link to="/learn" className="feat-more">
            すべて見る
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="feat-grid">
          {FEATURED.map((g) => (
            <Link key={g.id} to={`/game/${g.id}`} className="feat-card">
              <GameArt game={g} className="feat-cover" />
              <span className="feat-name">{g.gameTitle}</span>
              <span className="feat-meta">
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
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
