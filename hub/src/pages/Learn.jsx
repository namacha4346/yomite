import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SummaryCard from "../summary/SummaryCard.jsx";
import ScriptBuilder from "../script/ScriptBuilder.jsx";
import ScriptCard from "../script/ScriptCard.jsx";
import GameTile from "../script/GameTile.jsx";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { listScripts, createScript, removeScript } from "../script/store.js";

// 「教わる／教える」。
// ベースは【運営の台本を使う】（無料）。【台本を作る】は有料プランの機能。
export default function Learn() {
  const [tab, setTab] = useState("browse"); // browse | build
  const [shared, setShared] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [printTarget, setPrintTarget] = useState(null); // 印刷する早見表
  const [isPro, setIsPro] = useState(false); // 有料プランか（今は仮フラグ）
  const [query, setQuery] = useState(""); // 台本の検索語

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      setShared(await listScripts());
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  // 印刷対象がセットされたら、描画後にブラウザの印刷を呼ぶ。
  useEffect(() => {
    if (!printTarget) return;
    const t = setTimeout(() => window.print(), 50);
    const clear = () => setPrintTarget(null);
    window.addEventListener("afterprint", clear);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", clear);
    };
  }, [printTarget]);

  const handleSave = async (script) => {
    try {
      setShared(await createScript(script));
      setStatus("ok");
      setTab("browse");
    } catch {
      setStatus("error");
    }
  };
  const handleDelete = async (id) => {
    try {
      setShared(await removeScript(id));
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="page page--learn">
      <span className="page-hurdle">インストのハードル</span>
      <h1 className="page-title">教わる／教える</h1>
      <p className="page-lead">
        運営がつくったインスト台本を、そのまま使える。台本には遊ぶとき用の早見表（サマリー）も付いてくる。
      </p>

      <div className="tabs">
        <button
          className={"tab" + (tab === "browse" ? " is-active" : "")}
          onClick={() => setTab("browse")}
        >
          台本をつかう
        </button>
        <button
          className={"tab" + (tab === "build" ? " is-active" : "")}
          onClick={() => setTab("build")}
        >
          台本をつくる
          <span className="tab-pro">PRO</span>
        </button>
      </div>

      {status === "error" && (
        <div className="banner banner--error">
          サーバーに接続できませんでした。バックエンド（hub/server）が起動しているか確認してください。
        </div>
      )}

      {tab === "build" ? (
        isPro ? (
          <ScriptBuilder onSave={handleSave} isPro={isPro} />
        ) : (
          <Paywall onTryDemo={() => setIsPro(true)} />
        )
      ) : (
        <Browse
          query={query}
          setQuery={setQuery}
          official={SAMPLE_SCRIPTS}
          shared={shared}
          status={status}
          onDelete={handleDelete}
          onPrint={setPrintTarget}
        />
      )}

      <Link to="/" className="page-back">← トップに戻る</Link>

      {/* 印刷専用のシート。画面では見えず、印刷時だけ紙に出る（@media print）。 */}
      {printTarget && (
        <div className="print-sheet">
          <SummaryCard summary={printTarget} />
          <p className="print-foot">ボードゲームひろば（仮） — サマリー早見表</p>
        </div>
      )}
    </div>
  );
}

// 人数フィルタの選択肢
const PLAYER_FILTERS = [
  { key: "all", label: "すべて" },
  { key: "2", label: "2人" },
  { key: "34", label: "3〜4人" },
  { key: "5", label: "5人以上" },
];

// 台本をつかう＝まずゲームのカタログ（表紙・人数）から探し、
// タイルを選ぶと台本の詳細を開く。
function Browse({ query, setQuery, official, shared, status, onDelete, onPrint }) {
  const [players, setPlayers] = useState("all");
  const [openId, setOpenId] = useState(null);

  const q = query.trim().toLowerCase();
  const textMatch = (s) =>
    !q ||
    (s.gameTitle || "").toLowerCase().includes(q) ||
    (s.about || "").toLowerCase().includes(q);
  const playerMatch = (s) => {
    if (players === "all") return true;
    if (!s.players) return false;
    const { min, max } = s.players;
    if (players === "2") return min <= 2 && 2 <= max;
    if (players === "34") return min <= 4 && max >= 3;
    if (players === "5") return max >= 5;
    return true;
  };

  // 運営を先、みんなを後にまとめる
  const allGames = [
    ...official.map((s) => ({ ...s, _group: "official" })),
    ...shared.map((s) => ({ ...s, _group: "shared" })),
  ];
  const results = allGames.filter(textMatch).filter(playerMatch);

  // 詳細（台本）を開いているとき
  const open = openId ? allGames.find((s) => s.id === openId) : null;
  if (open) {
    return (
      <div className="cards">
        <button
          type="button"
          className="linkbtn back-catalog"
          onClick={() => setOpenId(null)}
        >
          ← 一覧にもどる
        </button>
        <ScriptCard
          script={open}
          onPrint={onPrint}
          onDelete={
            open._group === "shared"
              ? (id) => {
                  onDelete(id);
                  setOpenId(null);
                }
              : undefined
          }
        />
      </div>
    );
  }

  // カタログ（検索＋人数フィルタ＋タイル）
  return (
    <div className="catalog">
      <div className="search">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          className="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ゲーム名でさがす（例：宝石）"
          aria-label="ゲームをさがす"
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery("")}
            aria-label="検索をクリア"
          >
            ×
          </button>
        )}
      </div>

      {/* 人数で絞り込み */}
      <div className="filter-chips" role="group" aria-label="人数でしぼる">
        {PLAYER_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={"chip" + (players === f.key ? " is-on" : "")}
            onClick={() => setPlayers(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {status === "loading" && <p className="hint">読み込み中…</p>}
      {status !== "loading" && results.length === 0 && (
        <p className="hint">条件に合うゲームが見つかりませんでした。</p>
      )}

      <div className="tiles">
        {results.map((s) => (
          <GameTile key={s.id} script={s} onOpen={setOpenId} />
        ))}
      </div>
    </div>
  );
}

// 台本づくりは有料プランの機能。無料の人にはこの案内を出す。
function Paywall({ onTryDemo }) {
  return (
    <div className="paywall">
      <span className="paywall-badge">PRO プラン</span>
      <h3 className="paywall-title">台本づくりは有料プランの機能です</h3>
      <p className="paywall-lead">
        まずは運営の台本を無料で使えます。自分のゲームの台本を作りたくなったら、有料プランへ。
      </p>
      <ul className="paywall-list">
        <li>自分のゲームの台本を作成・共有できる</li>
        <li>台本から早見表（サマリー）を自動生成・印刷</li>
        <li>PRO アイコンが解禁される</li>
      </ul>
      <button className="savebtn" type="button">
        有料プランについて
      </button>
      <button className="paywall-demo" type="button" onClick={onTryDemo}>
        （デモ）試しに使ってみる →
      </button>
    </div>
  );
}
