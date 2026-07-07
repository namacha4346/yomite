import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Builder from "../summary/Builder.jsx";
import SummaryCard from "../summary/SummaryCard.jsx";
import { SAMPLE_SUMMARIES } from "../summary/samples.js";
import { listSummaries, createSummary, removeSummary } from "../summary/store.js";

// 「教わる／教える」＝サマリー共有プラットフォームのMVP。
// 運営の公式サンプル ＋ みんなが作ったサマリー（サーバー保存）を一覧表示できる。
export default function Learn() {
  const [tab, setTab] = useState("browse"); // browse | build
  const [shared, setShared] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [printTarget, setPrintTarget] = useState(null); // 印刷する1枚

  // 起動時にサーバーから共有サマリーを読む
  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      setShared(await listSummaries());
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  // 印刷対象がセットされたら、描画後にブラウザの印刷を呼ぶ。
  // 印刷ダイアログを閉じたら対象を戻す。
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

  const handleSave = async (summary) => {
    try {
      setShared(await createSummary(summary));
      setStatus("ok");
      setTab("browse"); // 保存したら一覧へ
    } catch {
      setStatus("error");
    }
  };
  const handleDelete = async (id) => {
    try {
      setShared(await removeSummary(id));
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="page page--learn">
      <span className="page-hurdle">インストのハードル</span>
      <h1 className="page-title">教わる／教える</h1>
      <p className="page-lead">
        「サマリー（早見表）」があるだけで、初心者の質問はぐっと減る。
        作って、みんなで共有しよう。
      </p>

      <div className="tabs">
        <button
          className={"tab" + (tab === "browse" ? " is-active" : "")}
          onClick={() => setTab("browse")}
        >
          みんなのサマリー
        </button>
        <button
          className={"tab" + (tab === "build" ? " is-active" : "")}
          onClick={() => setTab("build")}
        >
          サマリーを作る
        </button>
      </div>

      {status === "error" && (
        <div className="banner banner--error">
          サーバーに接続できませんでした。バックエンド（hub/server）が起動しているか確認してください。
        </div>
      )}

      {tab === "build" ? (
        <Builder onSave={handleSave} isPro={false} />
      ) : (
        <div className="cards">
          <h2 className="cards-h">みんなが作ったサマリー</h2>
          {status === "loading" && <p className="hint">読み込み中…</p>}
          {status === "ok" && shared.length === 0 && (
            <p className="hint">まだありません。「サマリーを作る」で最初の1枚を投稿しよう。</p>
          )}
          {shared.map((s) => (
            <SummaryCard
              key={s.id}
              summary={s}
              onDelete={handleDelete}
              onPrint={setPrintTarget}
            />
          ))}

          <h2 className="cards-h">公式サマリー（見本）</h2>
          {SAMPLE_SUMMARIES.map((s) => (
            <SummaryCard key={s.id} summary={s} onPrint={setPrintTarget} />
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
