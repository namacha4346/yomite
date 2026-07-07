import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Learn from "./pages/Learn.jsx";
import Place from "./pages/Place.jsx";
import Discover from "./pages/Discover.jsx";

// アプリの骨組み。上部に共通ヘッダーを置き、下でURLごとにページを切り替える。
export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app">
      <header className="header">
        {/* トップへ戻るロゴ。ミープル（コマ）のマーク＋名前。 */}
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 1 3 3c0 1.05-.54 1.97-1.35 2.51 1.94.62 3.12 1.86 3.6 3.63l.62 2.3c.24.9-.44 1.78-1.38 1.78h-1.3l.52 5.28A1 1 0 0 1 14.72 21H9.28a1 1 0 0 1-1-.99l.52-5.29H7.5c-.94 0-1.62-.88-1.38-1.79l.62-2.29c.48-1.77 1.66-3.01 3.6-3.63A3 3 0 0 1 12 2z" />
            </svg>
          </span>
          ボードゲームひろば<span className="logo-note">（仮）</span>
        </Link>
        {!isHome && (
          <Link to="/" className="back-link">
            ← トップへ
          </Link>
        )}
      </header>

      <main className="main">
        {/* Routes の中で「このURLならこのページ」を対応づける（ルーティング） */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/place" element={<Place />} />
          <Route path="/discover" element={<Discover />} />
          {/* どのURLにも当てはまらないときはトップを出す */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="footer">
        ボードゲームを、日本の"ふつうの遊び"に。
      </footer>
    </div>
  );
}
