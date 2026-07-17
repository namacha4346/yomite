import { Link } from "react-router-dom";
import { linkify } from "./glossary.js";
import Iconize from "./iconize.jsx";

// 台本本文を描画しつつ、用語を初出だけリンクする。
// ・一般用語 → 用語辞典（/glossary）へ
// ・ゲーム専用用語 → 同じ台本の「専門用語」タブへ（onGameTerm で切替＆スクロール）
// pre-wrap 前提（改行はそのまま活きる）。
export default function GlossaryText({ text, gameId, onGameTerm }) {
  const parts = linkify(text, gameId);
  return (
    <>
      {parts.map((p, i) => {
        if (!p.id) return <Iconize key={i} text={p.text} />;
        if (p.kind === "game") {
          return (
            <button
              key={i}
              type="button"
              className="term-link term-link--game"
              onClick={() => onGameTerm && onGameTerm(p.id)}
            >
              {p.text}
            </button>
          );
        }
        return (
          <Link key={i} className="term-link" to={`/glossary?t=${p.id}`}>
            {p.text}
          </Link>
        );
      })}
    </>
  );
}
