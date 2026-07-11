import { useState } from "react";
import { ask } from "./ask.js";
import { Icon } from "../ui/graphics.jsx";

// 共有デモ（単体HTML）は端末内で簡易回答＝外部送信なし。
// 本番のAIモードのみ、入力を外部AIサービスへ送信する。
const DEMO =
  import.meta.env.VITE_DEMO === "1" || import.meta.env.VITE_DEMO === true;

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

      {!DEMO && (
        <p className="askbox-privacy">
          入力した質問は、回答生成のため外部のAIサービスに送信されます。個人情報や
          公開したくない内容は入力しないでください。
        </p>
      )}

      {answer && (
        <div className="askbox-answer">
          <p className="askbox-q">Q. {answer.question}</p>
          <div className="askbox-a">
            {answer.text.split("\n").map((line, i) => (
              <p key={i}>{line || " "}</p>
            ))}
          </div>
          {answer.mode === "demo" && (
            <p className="askbox-demo">
              （デモ回答：台本データをもとに端末内で作成。本番では本物のAIが答えます）
            </p>
          )}
          <p className="askbox-note">
            ※ AIの回答は台本をもとにした参考情報です。正確でない場合があります。
            最終的なルールは、各ゲームの公式説明書をご確認ください。
          </p>
        </div>
      )}
    </section>
  );
}
