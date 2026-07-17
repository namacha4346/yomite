import { useState } from "react";
import {
  listComments,
  addComment,
  deleteComment,
  reportComment,
  toggleCommentLike,
} from "./comments.js";

// 台本ごとのコメント欄（フラット＋いいね＋人気→新着順）。
// 閲覧は誰でも、投稿はログイン必須（無ければ onNeedName）。
export default function Comments({ scriptId, user, onNeedName }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [, setN] = useState(0);
  const bump = () => setN((v) => v + 1);

  const comments = listComments(scriptId);

  const submit = (e) => {
    e.preventDefault();
    if (!user) {
      onNeedName && onNeedName();
      return;
    }
    const r = addComment(scriptId, user, text);
    if (r.error) {
      setErr(r.error);
      return;
    }
    setText("");
    setErr("");
    bump();
  };

  return (
    <section className="comments">
      <h4 className="comments-h">コメント（{comments.length}）</h4>

      <form className="comment-form" onSubmit={submit}>
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            user ? "この台本にコメント…" : "コメントするにはログイン"
          }
          maxLength={500}
        />
        <button type="submit" className="comment-send">
          送信
        </button>
      </form>
      {err && <p className="hint comment-err">{err}</p>}

      {comments.length === 0 ? (
        <p className="hint">まだコメントはありません。最初の一言をどうぞ。</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => {
            const liked = user && (c.likedBy || []).includes(user);
            const mine = user && c.user === user;
            return (
              <li className="comment" key={c.id}>
                <span className="comment-avatar" aria-hidden="true">
                  {(c.user || "?").slice(0, 1)}
                </span>
                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="comment-user">@{c.user}</span>
                    <span className="comment-time">
                      {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                  <div className="comment-actions">
                    <button
                      type="button"
                      className={"clike" + (liked ? " is-on" : "")}
                      onClick={() => {
                        if (!user) return onNeedName && onNeedName();
                        toggleCommentLike(scriptId, c.id, user);
                        bump();
                      }}
                    >
                      {liked ? "❤️" : "🤍"} {(c.likedBy || []).length}
                    </button>
                    {mine ? (
                      <button
                        type="button"
                        className="clink"
                        onClick={() => {
                          deleteComment(scriptId, c.id);
                          bump();
                        }}
                      >
                        削除
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="clink"
                        onClick={() => {
                          reportComment(scriptId, c.id);
                          bump();
                        }}
                      >
                        通報
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
