import { Link } from "react-router-dom";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { GameArt, Icon } from "../ui/graphics.jsx";

// トップ画面：コンセプト一言 ＋ 3つの入口（扉）＋ 注目のゲーム。
// 3つのハードル（インスト・場所・認知）にそれぞれ対応している。
const DOORS = [
  {
    to: "/learn",
    label: "教わる／教える",
    hurdle: "インストがラクに",
    desc: "名作の教え方が、ぜんぶ台本に。",
    key: "learn",
    icon: "book",
  },
  {
    to: "/discover",
    label: "出会う",
    hurdle: "はじめの一作に出会う",
    desc: "簡単な質問で、ぴったりの1本へ。",
    key: "discover",
    icon: "compass",
  },
  {
    to: "/place",
    label: "集まる",
    hurdle: "遊ぶ場所を見つける",
    desc: "近くの卓・お店で、遊ぶ場所へ。",
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
          宝石の煌めき・ドミニオン・カルカソンヌ…名作の“教え方”がそろってる。
          登録なしで、今すぐ読める。
        </p>
        <div className="hero-cta">
          <Link to="/discover" className="btn btn--primary hero-cta-btn">
            {/* 折り返しても「ぴったり診断」の途中で割れないように束ねる */}
            <span className="nowrap">はじめての人は</span>
            <span className="nowrap">「ぴったり診断」から</span>
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

      <Link to="/learn?script=splendor" className="ai-teaser">
        <span className="ai-teaser-badge">
          <Icon name="search" />
          AIに質問
        </span>
        <span className="ai-teaser-text">
          ルールで迷ったら、台本をもとにAIに聞ける（回答は参考情報。最終判断は公式説明書で）。
        </span>
        <span className="ai-teaser-arrow" aria-hidden="true">
          <Icon name="arrow" />
        </span>
      </Link>

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
