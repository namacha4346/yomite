import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SummaryCard from "../summary/SummaryCard.jsx";
import ScriptBuilder from "../script/ScriptBuilder.jsx";
import ScriptCard from "../script/ScriptCard.jsx";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { listScripts, createScript, removeScript } from "../script/store.js";

// 「教わる／教える」＝インスト台本の作成・共有プラットフォーム。
// 台本を書くと、そこから早見表（サマリー）が自動生成される。
export default function Learn() {
  const [tab, setTab] = useState("browse"); // browse | build
  const [shared, setShared] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [printTarget, setPrintTarget] = useState(null); // 印刷する早見表

  // 起動時にサーバーから共有台本を読む
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
      setTab("browse"); // 保存したら一覧へ
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
        インストの台本を書くと、遊ぶとき用の早見表（サマリー）も自動でできる。
        書いて、みんなで共有しよう。
      </p>

      <div className="tabs">
        <button
          className={"tab" + (tab === "browse" ? " is-active" : "")}
          onClick={() => setTab("browse")}
        >
          みんなの台本
        </button>
        <button
          className={"tab" + (tab === "build" ? " is-active" : "")}
          onClick={() => setTab("build")}
        >
          台本を作る
        </button>
      </div>

      {status === "error" && (
        <div className="banner banner--error">
          サーバーに接続できませんでした。バックエンド（hub/server）が起動しているか確認してください。
        </div>
      )}

      {tab === "build" ? (
        <ScriptBuilder onSave={handleSave} isPro={false} />
      ) : (
        <div className="cards">
          <h2 className="cards-h">みんなが作った台本</h2>
          {status === "loading" && <p className="hint">読み込み中…</p>}
          {status === "ok" && shared.length === 0 && (
            <p className="hint">まだありません。「台本を作る」で最初の1本を書こう。</p>
          )}
          {shared.map((s) => (
            <ScriptCard
              key={s.id}
              script={s}
              onDelete={handleDelete}
              onPrint={setPrintTarget}
            />
          ))}

          <h2 className="cards-h">公式の台本（見本）</h2>
          {SAMPLE_SCRIPTS.map((s) => (
            <ScriptCard key={s.id} script={s} onPrint={setPrintTarget} />
          ))}
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
