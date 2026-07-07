import { useState } from "react";
import SummaryCard from "../summary/SummaryCard.jsx";
import { SECTIONS } from "./sections.js";
import { deriveSummary } from "./model.js";

// 台本1件の表示。「台本を読む」と「早見表」を切り替えられる。
// 早見表は台本から自動生成した SummaryCard（表裏・印刷つき）。
export default function ScriptCard({ script, onDelete, onPrint }) {
  const [view, setView] = useState("script"); // script | summary
  const { gameTitle, official } = script;
  const summary = deriveSummary(script);

  return (
    <article className="scriptcard">
      <header className="scard-band">
        <div className="scard-band-main">
          <span className="scard-kicker">インスト台本</span>
          <h3 className="scard-title">{gameTitle || "（無題の台本）"}</h3>
        </div>
        {official && <span className="scard-official">公式</span>}
      </header>

      <div className="face-switch" role="tablist" aria-label="表示切替">
        <button
          role="tab"
          aria-selected={view === "script"}
          className={"face-switch-btn" + (view === "script" ? " is-on" : "")}
          onClick={() => setView("script")}
        >
          台本を読む
        </button>
        <button
          role="tab"
          aria-selected={view === "summary"}
          className={"face-switch-btn" + (view === "summary" ? " is-on" : "")}
          onClick={() => setView("summary")}
        >
          早見表
        </button>
      </div>

      {view === "script" ? (
        <div className="script-body">
          {SECTIONS.map((sec) => (
            <section className="sec-block" key={sec.key}>
              <h4 className="sec-label">
                {sec.no} {sec.label}
              </h4>
              {sec.type === "list" ? (
                <ol className="sec-list">
                  {(script.turn || []).filter(Boolean).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              ) : sec.type === "icons" ? (
                <ul className="sec-icons">
                  {(script.icons || [])
                    .filter((g) => g.icon || g.meaning)
                    .map((g, i) => (
                      <li key={i}>
                        <span className="sec-ic">{g.icon}</span>
                        <span>{g.meaning}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="sec-text">{script[sec.key]}</p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="script-summary">
          <SummaryCard summary={summary} onPrint={onPrint} />
        </div>
      )}

      <footer className="scard-foot">
        {onPrint && (
          <button className="linkbtn" onClick={() => onPrint(summary)}>
            🖨 早見表を印刷／PDF
          </button>
        )}
        {onDelete && (
          <button className="linkbtn" onClick={() => onDelete(script.id)}>
            削除
          </button>
        )}
      </footer>
    </article>
  );
}
