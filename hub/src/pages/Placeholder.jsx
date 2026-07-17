import { Link } from "react-router-dom";

// 3つの扉に共通の「準備中」ページ。中身が来るまでの仮置き。
// accent で扉ごとの色を切り替える（learn / place / discover）。
export default function Placeholder({ accent, hurdle, title, lead, todo }) {
  return (
    <div className={`page page--${accent}`}>
      <span className="page-hurdle">{hurdle}</span>
      <h1 className="page-title">{title}</h1>
      <p className="page-lead">{lead}</p>

      <div className="soon">
        <span className="soon-badge">準備中</span>
        <p className="soon-text">ここに、これから次のような機能を入れていきます。</p>
        <ul className="soon-list">
          {todo.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}
