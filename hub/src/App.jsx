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
        {/* トップへ戻るロゴ。トップにいるときはリンクを目立たせない。 */}
        <Link to="/" className="logo">
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
