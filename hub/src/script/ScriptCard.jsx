import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SummaryCard from "../summary/SummaryCard.jsx";
import LikeButton from "../social/LikeButton.jsx";
import Comments from "../social/Comments.jsx";
import { SECTIONS, THEMES } from "./sections.js";
import { deriveSummary, normalizeThemeOrder } from "./model.js";
import { Icon } from "../ui/graphics.jsx";
import { gameColor } from "../ui/gameColor.js";
import { buyUrl } from "../ui/buy.js";
import AskBox from "../ai/AskBox.jsx";
import GlossaryText from "./GlossaryText.jsx";
import { gameTerms } from "./glossary.js";

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

// 概要文の末尾にある「2〜4人・約30分」などのメタ表記を取り除く
// （人数・時間はタイトル下のチップで別に見せるので、本文では重複させない）。
function stripMeta(about) {
  return String(about || "")
    .replace(/[0-9０-９]+[〜～][0-9０-９]+人[^。]*。?\s*$/, "")
    .trim();
}

// 台本の1セクションを描画（gameId・onGameTerm は用語リンク用）
function renderSection(sec, script, gameId, onGameTerm) {
  const text = sec.key === "about" ? stripMeta(script[sec.key]) : script[sec.key];
  return (
    <section className="sec-block" key={sec.key}>
      <h4 className="sec-label">{sec.label}</h4>
      {sec.type === "list" ? (
        <ol className="sec-list">
          {(script.turn || []).filter(Boolean).map((t, i) => (
            <li key={i}>
              <GlossaryText text={t} gameId={gameId} onGameTerm={onGameTerm} />
            </li>
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
        <p className="sec-text">
          <GlossaryText text={text} gameId={gameId} onGameTerm={onGameTerm} />
        </p>
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
  const terms = gameTerms(script.id); // このゲームだけの専用用語
  const tabs = [
    ...orderedThemes,
    { id: "summary", label: "早見表" },
    ...(terms.length > 0 ? [{ id: "terms", label: "専門用語" }] : []),
  ];

  const [tab, setTab] = useState(order[0]);
  const [focusTerm, setFocusTerm] = useState(null); // 専門用語タブで注目する語
  const termsRef = useRef(null);
  const tablistRef = useRef(null); // 横スクロールするタブ列
  const { gameTitle, official, players, time } = script;
  const summary = deriveSummary(script);
  const activeTheme = THEMES.find((t) => t.id === tab);

  // 本文の専用用語リンクから「専門用語」タブへ飛ぶ
  const goToTerm = (id) => {
    setTab("terms");
    setFocusTerm(id);
  };

  // 選択中のタブが画面外（横スクロールの先）なら、見える位置へ寄せる
  useEffect(() => {
    const el = tablistRef.current?.querySelector('[aria-selected="true"]');
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [tab]);

  // 専門用語タブに切り替わったら、対象の語までスクロール＆ハイライト
  useEffect(() => {
    if (tab !== "terms" || !focusTerm || !termsRef.current) return;
    const el = termsRef.current.querySelector(`[data-term="${focusTerm}"]`);
    if (!el) return;
    el.scrollIntoView({ block: "center" });
    el.classList.add("term-hit");
    const t = setTimeout(() => el.classList.remove("term-hit"), 1600);
    return () => clearTimeout(t);
  }, [tab, focusTerm]);

  return (
    <article className="scriptcard" style={{ "--ac": gameColor(script) }}>
      <header className="scard-band">
        <div className="scard-band-main">
          <span className="scard-kicker">
            <AuthorLabel script={script} />
          </span>
          <h3 className="scard-title">{gameTitle || "（無題の台本）"}</h3>
          {(players || time) && (
            <div className="scard-meta">
              {players && (
                <span className="scard-chip">
                  <Icon name="users" />
                  {players.min}–{players.max}人
                </span>
              )}
              {time && (
                <span className="scard-chip">
                  <Icon name="clock" />約{time}分
                </span>
              )}
            </div>
          )}
        </div>
        {official && <span className="scard-official">運営</span>}
      </header>

      <div className="face-switch" role="tablist" aria-label="台本のテーマ" ref={tablistRef}>
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
          {official && (
            <div className="summary-tools">
              <Link className="linkbtn" to={`/layout?script=${script.id}`}>
                ✎ 自分だけの早見表をつくって印刷（PRO）
              </Link>
            </div>
          )}
        </div>
      ) : tab === "terms" ? (
        <div className="script-body">
          <div className="terms-tab" ref={termsRef}>
            <p className="terms-tab-lead">
              このゲームだけで使う言い回し・名詞です。本文中の色つきの語からも飛べます。
            </p>
            <dl className="game-terms-list">
              {terms.map((t) => (
                <div className="game-term" data-term={t.id} key={t.id}>
                  <dt className="game-term-word">
                    {t.term}
                    {t.aliases && t.aliases.length > 0 && (
                      <span className="game-term-alias">
                        （{t.aliases.join("・")}）
                      </span>
                    )}
                  </dt>
                  <dd className="game-term-def">{t.def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : (
        <div className="script-body">
          {SECTIONS.filter((s) => activeTheme.keys.includes(s.key)).map((sec) =>
            renderSection(sec, script, script.id, goToTerm)
          )}
        </div>
      )}

      <AskBox script={script} />

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
            運営のお勧めを下敷きに、自分のインスト用へ書き換えられます。
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
            買う
          </a>
        )}
        {onPrint && (
          <button className="linkbtn linkbtn--icon" onClick={() => onPrint(summary)}>
            <Icon name="print" />
            印刷／PDF
          </button>
        )}
        {onDelete && (
          <button className="linkbtn" onClick={() => onDelete(script.id)}>
            削除
          </button>
        )}
        {!official && (
          <Link className="linkbtn scard-report" to="/rights" title="権利侵害の報告">
            権利侵害を報告
          </Link>
        )}
      </footer>

      {showComments && (
        <Comments scriptId={script.id} user={user} onNeedName={onNeedName} />
      )}
    </article>
  );
}
