import { useState } from "react";
import { withSides } from "./model.js";

// 1つのセクション見出し
function SecHead({ children }) {
  return <h4 className="scard-h">{children}</h4>;
}

// 各セクションの描画（中身が空なら null を返す）
function renderSection(key, s) {
  const actions = (s.turnActions || []).filter(Boolean);
  const glossary = (s.icons || []).filter((g) => g.icon || g.meaning);

  if (key === "turn") {
    if (actions.length === 0) return null;
    return (
      <section className="scard-sec" key="turn">
        <SecHead>手番でできること</SecHead>
        <ol className="scard-steps">
          {actions.map((a, i) => (
            <li key={i} className="step">
              <span className="step-no">{i + 1}</span>
              <span className="step-text">{a}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }
  if (key === "icons") {
    if (glossary.length === 0) return null;
    return (
      <section className="scard-sec" key="icons">
        <SecHead>アイコン早見表</SecHead>
        <ul className="scard-icons">
          {glossary.map((g, i) => (
            <li key={i} className="gitem">
              <span className="gitem-ic">{g.icon}</span>
              <span className="gitem-mean">{g.meaning}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  if (key === "end") {
    if (!s.endCondition) return null;
    return (
      <section className="scard-sec" key="end">
        <SecHead>終了条件</SecHead>
        <div className="scard-end">
          <span className="scard-end-flag" aria-hidden="true">🏁</span>
          <p className="scard-end-text">{s.endCondition}</p>
        </div>
      </section>
    );
  }
  return null;
}

// どのセクションがどちらの面かの対応
const SECTION_SIDE = {
  turn: "turnActionsSide",
  icons: "iconsSide",
  end: "endConditionSide",
};
// 面の中での並び順
const ORDER = ["turn", "end", "icons"];

// 作られたサマリーを「表裏1枚の早見表」として表示する部品。
export default function SummaryCard({ summary, onDelete, onPrint }) {
  const s = withSides(summary);
  const { gameTitle, official } = s;

  // 面ごとに、割り当てられた＆中身のあるセクションを集める
  const facesDef = [
    { side: "front", label: "表" },
    { side: "back", label: "裏" },
  ];
  const faces = facesDef
    .map((f) => {
      const nodes = ORDER.filter((k) => s[SECTION_SIDE[k]] === f.side)
        .map((k) => renderSection(k, s))
        .filter(Boolean);
      return { ...f, nodes };
    })
    .filter((f) => f.nodes.length > 0);

  // 画面で表示中の面（印刷には影響しない）
  const [active, setActive] = useState(faces[0]?.side || "front");
  const activeSide = faces.some((f) => f.side === active) ? active : faces[0]?.side;

  return (
    <article className="scard">
      {/* ヘッダー帯 */}
      <header className="scard-band">
        <div className="scard-band-main">
          <span className="scard-kicker">サマリー早見表</span>
          <h3 className="scard-title">{gameTitle || "（無題のサマリー）"}</h3>
        </div>
        {official && <span className="scard-official">公式</span>}
      </header>

      {/* 面プレビュー切替（2面あるときだけ・印刷では出さない） */}
      {faces.length > 1 && (
        <div className="face-switch" role="tablist" aria-label="表裏の切替">
          {faces.map((f) => (
            <button
              key={f.side}
              role="tab"
              aria-selected={f.side === activeSide}
              className={"face-switch-btn" + (f.side === activeSide ? " is-on" : "")}
              onClick={() => setActive(f.side)}
            >
              {f.label}面
            </button>
          ))}
        </div>
      )}

      <div className="scard-body">
        {faces.map((f) => (
          <section
            className={
              "scard-face" + (f.side === activeSide ? "" : " is-hidden-screen")
            }
            key={f.side}
          >
            <div className="face-head">
              <span className="face-badge">{f.label}</span>
              <span className="face-gametitle">{gameTitle}</span>
            </div>
            {f.nodes}
          </section>
        ))}
      </div>

      {(onPrint || onDelete) && (
        <footer className="scard-foot">
          {onPrint && (
            <button className="linkbtn" onClick={() => onPrint(summary)}>
              🖨 印刷／PDF
            </button>
          )}
          {onDelete && (
            <button className="linkbtn" onClick={() => onDelete(summary.id)}>
              削除
            </button>
          )}
        </footer>
      )}
    </article>
  );
}
