import { useState } from "react";
import { normalizeHandle } from "../social/auth.js";

// 登録／ログイン画面。未登録のときにサイト全体の手前に出る。
// デモ仕様：ハンドルと表示名を決めるだけ（本番はメール／SNS認証に差し替え）。
export default function AuthGate({ onRegister }) {
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const h = normalizeHandle(handle);
  const canGo = h.length >= 2;

  const submit = (e) => {
    e.preventDefault();
    if (!canGo) return;
    onRegister({ handle: h, name: name.trim() || h });
  };

  return (
    <div className="gate">
      <div className="gate-card">
        <span className="logo-mark gate-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 1 3 3c0 1.05-.54 1.97-1.35 2.51 1.94.62 3.12 1.86 3.6 3.63l.62 2.3c.24.9-.44 1.78-1.38 1.78h-1.3l.52 5.28A1 1 0 0 1 14.72 21H9.28a1 1 0 0 1-1-.99l.52-5.29H7.5c-.94 0-1.62-.88-1.38-1.79l.62-2.29c.48-1.77 1.66-3.01 3.6-3.63A3 3 0 0 1 12 2z" />
          </svg>
        </span>
        <h1 className="gate-title">ボードゲームひろば</h1>
        <p className="gate-sub">
          はじめるにはアカウントが必要です。ニックネームを決めて登録しよう。
        </p>

        <form className="gate-form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">ユーザーID（@のあと・英数字）</span>
            <div className="gate-handle">
              <span className="gate-at">@</span>
              <input
                className="input"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="taro"
                autoFocus
              />
            </div>
          </label>
          <label className="field">
            <span className="field-label">表示名（任意）</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="たろう"
            />
          </label>
          <button className="savebtn gate-go" type="submit" disabled={!canGo}>
            登録してはじめる
          </button>
          {!canGo && handle && (
            <p className="hint">ユーザーIDは英数字2文字以上で入力してください。</p>
          )}
        </form>

        <p className="gate-note">
          ※ これはデモです。パスワードやメールは不要で、この端末内だけに保存されます。
          本番では正式なログイン（メール／SNS認証）に差し替えます。
        </p>
      </div>
    </div>
  );
}
