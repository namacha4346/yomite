import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Learn from "./pages/Learn.jsx";
import Place from "./pages/Place.jsx";
import Discover from "./pages/Discover.jsx";
import Profile from "./pages/Profile.jsx";
import AuthGate from "./pages/AuthGate.jsx";
import { AuthContext } from "./social/AuthContext.js";
import { getAccount, saveAccount, clearAccount } from "./social/auth.js";

const Meeple = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a3 3 0 0 1 3 3c0 1.05-.54 1.97-1.35 2.51 1.94.62 3.12 1.86 3.6 3.63l.62 2.3c.24.9-.44 1.78-1.38 1.78h-1.3l.52 5.28A1 1 0 0 1 14.72 21H9.28a1 1 0 0 1-1-.99l.52-5.29H7.5c-.94 0-1.62-.88-1.38-1.79l.62-2.29c.48-1.77 1.66-3.01 3.6-3.63A3 3 0 0 1 12 2z" />
  </svg>
);

// アプリの骨組み。未登録なら登録画面でゲートし、登録後に本編を出す。
export default function App() {
  const [account, setAccount] = useState(getAccount());

  // 未登録：サイト全体の手前に登録／ログイン画面
  if (!account) {
    return <AuthGate onRegister={(a) => setAccount(saveAccount(a))} />;
  }

  const logout = () => {
    clearAccount();
    setAccount(null);
  };

  return (
    <AuthContext.Provider value={{ account, logout }}>
      <div className="app">
        <header className="header">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              <Meeple />
            </span>
            ボードゲームひろば<span className="logo-note">（仮）</span>
          </Link>

          {/* アカウント（アバター＝プロフィールへ、ログアウト） */}
          <div className="acct">
            <Link to={`/u/${account.handle}`} className="acct-chip" title="プロフィール">
              <span className="acct-avatar" aria-hidden="true">
                {account.handle.slice(0, 1)}
              </span>
              <span className="acct-handle">@{account.handle}</span>
            </Link>
            <button type="button" className="acct-logout" onClick={logout}>
              ログアウト
            </button>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/place" element={<Place />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/u/:handle" element={<Profile />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <footer className="footer">
          ボードゲームを、日本の"ふつうの遊び"に。
        </footer>
      </div>
    </AuthContext.Provider>
  );
}
