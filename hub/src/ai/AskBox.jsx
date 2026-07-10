import { useState } from "react";
import { ask } from "./ask.js";
import { Icon } from "../ui/graphics.jsx";

// よくある質問（クリックでそのまま質問できる）
const SUGGESTIONS = [
  "どうやって勝つの？",
  "自分の手番で何ができる？",
  "いつ終わるの？",
  "準備は何をする？",
];

// 台本カードの中に置く「このゲームについてAIに質問」欄。
// 共有デモでは台本ベースの簡易回答、フルアプリでは本物のAIが答える。
export default function AskBox({ script }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null); // { text, mode, refs, question }

  async function submit(question) {
    const text = (question ?? q).trim();
    if (!text || loading) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await ask(script, text);
      setAnswer({ ...res, question: text });
    } catch {
      setAnswer({
        text: "うまく答えられませんでした。もう一度お試しください。",
        mode: "demo",
        refs: [],
        question: text,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="askbox">
      <div className="askbox-head">
        <span className="askbox-badge">
          <Icon name="search" /> AIに質問
        </span>
        <span className="askbox-sub">このゲームのルールについて聞けます</span>
      </div>

      <div className="askbox-chips">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="askbox-chip"
            onClick={() => {
              setQ(s);
              submit(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="askbox-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          className="askbox-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="例）3人でも遊べる？ 手番は何回まで？"
          aria-label="このゲームへの質問"
        />
        <button
          type="submit"
          className="askbox-send"
          disabled={loading || !q.trim()}
        >
          {loading ? "…" : "質問"}
        </button>
      </form>

      {answer && (
        <div className="askbox-answer">
          <p className="askbox-q">Q. {answer.question}</p>
          <div className="askbox-a">
            {answer.text.split("\n").map((line, i) => (
              <p key={i}>{line || " "}</p>
            ))}
          </div>
          {answer.mode === "demo" && (
            <p className="askbox-note">
              ※ これは台本をもとにしたデモ回答です。本番では本物のAIが、もっと自然に答えます。
            </p>
          )}
        </div>
      )}
    </section>
  );
}
