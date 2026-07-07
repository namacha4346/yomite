import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Builder from "../summary/Builder.jsx";
import SummaryCard from "../summary/SummaryCard.jsx";
import { SAMPLE_SUMMARIES } from "../summary/samples.js";
import { loadSummaries, addSummary, deleteSummary } from "../summary/store.js";

// 「教わる／教える」＝サマリー共有プラットフォームのMVP。
// 運営の公式サンプル ＋ 自分で作ったサマリーを一覧表示できる。
export default function Learn() {
  const [tab, setTab] = useState("browse"); // browse | build
  const [mine, setMine] = useState([]);

  // 起動時にブラウザ内の保存を読む
  useEffect(() => {
    setMine(loadSummaries());
  }, []);

  const handleSave = (summary) => {
    setMine(addSummary(summary));
    setTab("browse"); // 保存したら一覧へ
  };
  const handleDelete = (id) => setMine(deleteSummary(id));

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

      {tab === "build" ? (
        <Builder onSave={handleSave} isPro={false} />
      ) : (
        <div className="cards">
          {mine.length > 0 && (
            <>
              <h2 className="cards-h">あなたが作ったサマリー</h2>
              {mine.map((s) => (
                <SummaryCard key={s.id} summary={s} onDelete={handleDelete} />
              ))}
            </>
          )}
          <h2 className="cards-h">公式サマリー（見本）</h2>
          {SAMPLE_SUMMARIES.map((s) => (
            <SummaryCard key={s.id} summary={s} />
          ))}
        </div>
      )}

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}
