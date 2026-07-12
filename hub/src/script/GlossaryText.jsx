import { Link } from "react-router-dom";
import { linkify } from "./glossary.js";

// 台本本文を描画しつつ、用語辞典に載っている語（初出）を辞典へリンクする。
// pre-wrap 前提（改行はそのまま活きる）。
export default function GlossaryText({ text }) {
  const parts = linkify(text);
  return (
    <>
      {parts.map((p, i) =>
        p.id ? (
          <Link key={i} className="term-link" to={`/glossary?t=${p.id}`}>
            {p.text}
          </Link>
        ) : (
          p.text
        )
      )}
    </>
  );
}
