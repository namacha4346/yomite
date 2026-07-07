import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SummaryCard from "../summary/SummaryCard.jsx";
import ScriptBuilder from "../script/ScriptBuilder.jsx";
import ScriptCard from "../script/ScriptCard.jsx";
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
        <div className="cards">
          {/* ベース＝運営の台本 */}
          <h2 className="cards-h">運営の台本</h2>
          {SAMPLE_SCRIPTS.map((s) => (
            <ScriptCard key={s.id} script={s} onPrint={setPrintTarget} />
          ))}

          {/* 有料プランの人が作った台本 */}
          {status === "ok" && shared.length > 0 && (
            <>
              <h2 className="cards-h">みんなの台本</h2>
              {shared.map((s) => (
                <ScriptCard
                  key={s.id}
                  script={s}
                  onDelete={handleDelete}
                  onPrint={setPrintTarget}
                />
              ))}
            </>
          )}
          {status === "loading" && <p className="hint">読み込み中…</p>}
        </div>
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
