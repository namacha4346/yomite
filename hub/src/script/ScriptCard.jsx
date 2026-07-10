import { useState } from "react";
import { Link } from "react-router-dom";
import SummaryCard from "../summary/SummaryCard.jsx";
import LikeButton from "../social/LikeButton.jsx";
import Comments from "../social/Comments.jsx";
import { SECTIONS, THEMES } from "./sections.js";
import { deriveSummary, normalizeThemeOrder } from "./model.js";
import { Icon } from "../ui/graphics.jsx";
import { buyUrl } from "../ui/buy.js";

// 作者の表示（公式は運営、投稿は @handle をプロフィールへリンク）
function AuthorLabel({ script }) {
  if (script.official) return <>インスト台本・作者 運営</>;
  if (script.author)
    return (
      <>
        インスト台本・作者{" "}
        <Link className="author-link" to={`/u/${script.author}`}>
          @{script.author}
        </Link>
      </>
    );
  return <>インスト台本・作者 みんな</>;
}

// 台本の1セクションを描画
function renderSection(sec, script) {
  return (
    <section className="sec-block" key={sec.key}>
      <h4 className="sec-label">{sec.label}</h4>
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
  );
}

// 台本1件の表示。テーマごとのタブで切り替える（縦長にならないように）。
// 最後のタブ「早見表」は台本から自動生成した SummaryCard。
export default function ScriptCard({
  script,
  onDelete,
  onPrint,
  onFork,
  user,
  onNeedName,
  onLikeChange,
  showComments = false,
}) {
  // 台本に保存された「作者が決めた教える順番」で表示（無ければ公式順）
  const order = normalizeThemeOrder(script.themeOrder);
  const orderedThemes = order.map((id) => THEMES.find((t) => t.id === id));
  const tabs = [...orderedThemes, { id: "summary", label: "早見表" }];

  const [tab, setTab] = useState(order[0]);
  const { gameTitle, official } = script;
  const summary = deriveSummary(script);
  const activeTheme = THEMES.find((t) => t.id === tab);

  return (
    <article className="scriptcard">
      <header className="scard-band">
        <div className="scard-band-main">
          <span className="scard-kicker">
            <AuthorLabel script={script} />
          </span>
          <h3 className="scard-title">{gameTitle || "（無題の台本）"}</h3>
        </div>
        {official && <span className="scard-official">公式</span>}
      </header>

      <div className="face-switch" role="tablist" aria-label="台本のテーマ">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === tab}
            className={"face-switch-btn" + (t.id === tab ? " is-on" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "summary" ? (
        <div className="script-summary">
          {/* 帯なしの埋め込み表示（印刷は下のフッターから） */}
          <SummaryCard summary={summary} embedded />
        </div>
      ) : (
        <div className="script-body">
          {SECTIONS.filter((s) => activeTheme.keys.includes(s.key)).map((sec) =>
            renderSection(sec, script)
          )}
        </div>
      )}

      {onFork && (
        <div className="fork-cta-row">
          <button
            type="button"
            className="fork-cta"
            onClick={() => onFork(script)}
          >
            この台本をもとに自分版をつくる
            <span className="fork-cta-pro">PRO</span>
          </button>
          <span className="fork-cta-note">
            公式のお勧めを下敷きに、自分のインスト用へ書き換えられます。
          </span>
        </div>
      )}

      <footer className="scard-foot">
        <LikeButton
          id={script.id}
          user={user}
          onNeedName={onNeedName}
          onChange={onLikeChange}
        />
        <span className="foot-spacer" />
        {official && (
          <a
            className="linkbtn"
            href={buyUrl(gameTitle)}
            target="_blank"
            rel="noopener noreferrer"
          >
            このゲームを買う
          </a>
        )}
        {onPrint && (
          <button className="linkbtn linkbtn--icon" onClick={() => onPrint(summary)}>
            <Icon name="print" />
            早見表を印刷／PDF
          </button>
        )}
        {onDelete && (
          <button className="linkbtn" onClick={() => onDelete(script.id)}>
            削除
          </button>
        )}
      </footer>

      {showComments && (
        <Comments scriptId={script.id} user={user} onNeedName={onNeedName} />
      )}
    </article>
  );
}
