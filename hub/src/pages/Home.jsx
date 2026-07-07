import { Link } from "react-router-dom";

// トップ画面：コンセプト一言 ＋ 3つの入口（扉）ボタン。
// 3つのハードル（インスト・場所・認知）にそれぞれ対応している。
const DOORS = [
  {
    to: "/learn",
    label: "教わる／教える",
    hurdle: "インストのハードル",
    desc: "ルール説明を、初心者でもできるように。",
    key: "learn",
  },
  {
    to: "/place",
    label: "集まる",
    hurdle: "場所のハードル",
    desc: "近くの卓・お店を見つけて、遊ぶ場所へ。",
    key: "place",
  },
  {
    to: "/discover",
    label: "出会う",
    hurdle: "認知のハードル",
    desc: "自分に合う一作と出会う、はじめの一歩。",
    key: "discover",
  },
];

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
      </section>

      <nav className="doors" aria-label="3つの入口">
        {DOORS.map((d) => (
          <Link key={d.key} to={d.to} className={`door door--${d.key}`}>
            <span className="door-hurdle">{d.hurdle}</span>
            <span className="door-label">{d.label}</span>
            <span className="door-desc">{d.desc}</span>
            <span className="door-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
