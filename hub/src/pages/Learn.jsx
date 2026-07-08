import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SummaryCard from "../summary/SummaryCard.jsx";
import ScriptBuilder from "../script/ScriptBuilder.jsx";
import ScriptCard from "../script/ScriptCard.jsx";
import GameTile from "../script/GameTile.jsx";
import { sortMechanics } from "../script/mechanics.js";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { listScripts, createScript, removeScript } from "../script/store.js";
import { likeCount } from "../social/likes.js";
import { useAuth } from "../social/AuthContext.js";

// 「教わる／教える」。
// ベースは【運営の台本を使う】（無料）。【台本を作る】は有料プランの機能。
export default function Learn() {
  const [tab, setTab] = useState("browse"); // browse | build
  const [shared, setShared] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [printTarget, setPrintTarget] = useState(null); // 印刷する早見表
  const [isPro, setIsPro] = useState(false); // 有料プランか（今は仮フラグ）
  const [query, setQuery] = useState(""); // 台本の検索語
  const { account, requireLogin } = useAuth();
  const user = account ? account.handle : ""; // 未ログインは空
  const [searchParams] = useSearchParams();
  const initialOpenId = searchParams.get("script") || null; // 紹介ページから直行するとき
  const [, setLikeTick] = useState(0); // いいね変更で再描画するための刻み
  const bumpLike = () => setLikeTick((t) => t + 1);

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
      // 作者（ハンドル）を付けて投稿
      setShared(await createScript({ ...script, author: user }));
      setStatus("ok");
      setTab("browse");
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
        運営がつくったインスト台本を、そのまま使える。台本には遊ぶとき用の早見表（サマリー）も付いてくる。
      </p>

      <div className="tabs">
        <button
          className={"tab" + (tab === "browse" ? " is-active" : "")}
          onClick={() => setTab("browse")}
        >
          台本をつかう
        </button>
        <button
          className={"tab" + (tab === "build" ? " is-active" : "")}
          onClick={() => setTab("build")}
        >
          台本をつくる
          <span className="tab-pro">PRO</span>
        </button>
      </div>

      {status === "error" && (
        <div className="banner banner--error">
          サーバーに接続できませんでした。バックエンド（hub/server）が起動しているか確認してください。
        </div>
      )}

      {tab === "build" ? (
        !user ? (
          <LoginPrompt onLogin={requireLogin} />
        ) : isPro ? (
          <ScriptBuilder onSave={handleSave} isPro={isPro} />
        ) : (
          <Paywall onTryDemo={() => setIsPro(true)} />
        )
      ) : (
        <Browse
          query={query}
          setQuery={setQuery}
          official={SAMPLE_SCRIPTS}
          shared={shared}
          status={status}
          onDelete={handleDelete}
          onPrint={setPrintTarget}
          user={user}
          onNeedName={requireLogin}
          onLikeChange={bumpLike}
          initialOpenId={initialOpenId}
        />
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

// 人数フィルタ（複数選択できる）。8以上は「8人以上」にまとめる。
const PLAYER_BUCKETS = [
  { key: "2", label: "2人", n: 2 },
  { key: "3", label: "3人", n: 3 },
  { key: "4", label: "4人", n: 4 },
  { key: "5", label: "5人", n: 5 },
  { key: "6", label: "6人", n: 6 },
  { key: "7", label: "7人", n: 7 },
  { key: "8", label: "8人以上", n: 8, plus: true },
];

// 台本をつかう＝まずゲームのカタログ（表紙・人数）から探し、
// タイルを選ぶと台本の詳細を開く。
function Browse({
  query,
  setQuery,
  official,
  shared,
  status,
  onDelete,
  onPrint,
  user,
  onNeedName,
  onLikeChange,
  initialOpenId,
}) {
  const [players, setPlayers] = useState([]); // 選んだ人数バケツ（空＝すべて）
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("new"); // new | popular
  const [selectedGame, setSelectedGame] = useState(null); // 選んだゲーム（キー）
  const [openId, setOpenId] = useState(initialOpenId || null); // 開いている台本

  const togglePlayer = (k) =>
    setPlayers((ps) => (ps.includes(k) ? ps.filter((x) => x !== k) : [...ps, k]));

  const q = query.trim().toLowerCase();
  const textMatch = (s) =>
    !q ||
    (s.gameTitle || "").toLowerCase().includes(q) ||
    (s.about || "").toLowerCase().includes(q);
  const playerMatch = (s) => {
    if (players.length === 0) return true; // 未選択＝すべて
    if (!s.players) return false;
    const { min, max } = s.players;
    // 選んだ人数のどれかで遊べればOK（OR）
    return players.some((k) => {
      const bk = PLAYER_BUCKETS.find((b) => b.key === k);
      if (!bk) return false;
      return bk.plus ? max >= 8 : min <= bk.n && bk.n <= max;
    });
  };
  const genreMatch = (s) =>
    genre === "all" || (s.mechanics || []).includes(genre);

  // 全台本に区分をつける
  const allScripts = [
    ...official.map((s) => ({ ...s, _group: "official" })),
    ...shared.map((s) => ({ ...s, _group: "shared" })),
  ];
  const genres = sortMechanics(allScripts.flatMap((g) => g.mechanics || []));

  // ゲーム（タイトル）ごとにまとめる。rep=代表（公式優先）、list=公式→新しい順
  const groups = new Map();
  for (const s of allScripts) {
    const key = (s.gameTitle || "").trim() || s.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  const games = [...groups.entries()].map(([key, list]) => {
    // 公式を先に、その中はいいねが多い→新しい順
    const sorted = [...list].sort((a, b) => {
      const ao = a._group === "official" ? 0 : 1;
      const bo = b._group === "official" ? 0 : 1;
      if (ao !== bo) return ao - bo;
      const dl = likeCount(b.id) - likeCount(a.id);
      if (dl !== 0) return dl;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
    const rep = sorted.find((s) => s._group === "official") || sorted[0];
    const likes = list.reduce((n, s) => n + likeCount(s.id), 0);
    const newest = list.reduce((m, s) => Math.max(m, s.createdAt || 0), 0);
    return { key, rep, list: sorted, likes, newest };
  });

  // 【3層目】実際の台本を開いているとき
  if (openId) {
    const open = allScripts.find((s) => s.id === openId);
    if (open) {
      return (
        <div className="cards">
          <button
            type="button"
            className="linkbtn back-catalog"
            onClick={() => setOpenId(null)}
          >
            {selectedGame ? "← 台本一覧にもどる" : "← ゲーム一覧にもどる"}
          </button>
          <ScriptCard
            script={open}
            onPrint={onPrint}
            user={user}
            onNeedName={onNeedName}
            onLikeChange={onLikeChange}
            showComments
            onDelete={
              open._group === "shared"
                ? (id) => {
                    onDelete(id);
                    setOpenId(null);
                  }
                : undefined
            }
          />
        </div>
      );
    }
  }

  // 【2層目】そのゲームの「どの台本を使うか（公式か/みんなか）」を選ぶ
  if (selectedGame) {
    const g = games.find((x) => x.key === selectedGame);
    if (g) {
      return (
        <div className="cards">
          <button
            type="button"
            className="linkbtn back-catalog"
            onClick={() => setSelectedGame(null)}
          >
            ← ゲーム一覧にもどる
          </button>

          <div className="variants-head">
            <span
              className="variants-cover"
              style={{ background: g.rep.color || "#8a7f6c" }}
              aria-hidden="true"
            >
              {g.rep.coverEmoji || "🎲"}
            </span>
            <div>
              <h2 className="variants-title">{g.rep.gameTitle}</h2>
              <p className="variants-sub">どの台本を使う？（{g.list.length}本）</p>
            </div>
          </div>

          <div className="variants">
            {g.list.map((s) => (
              <button
                key={s.id}
                type="button"
                className="variant"
                onClick={() => setOpenId(s.id)}
              >
                <span
                  className={
                    "variant-badge" +
                    (s._group === "official" ? " is-official" : "")
                  }
                >
                  {s._group === "official" ? "公式" : "みんな"}
                </span>
                <span className="variant-main">
                  <span className="variant-name">
                    {s._group === "official"
                      ? "公式台本（運営）"
                      : s.author
                      ? "@" + s.author + " の台本"
                      : "みんなの台本"}
                  </span>
                  <span className="variant-note">
                    {(s._group === "official"
                      ? "運営がつくった台本"
                      : "投稿" +
                        (s.createdAt
                          ? "：" +
                            new Date(s.createdAt).toLocaleDateString("ja-JP")
                          : "")) + `　❤️ ${likeCount(s.id)}`}
                  </span>
                </span>
                <span className="variant-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
  }

  // 【1層目】ゲームのカタログ（検索＋人数・ジャンル＋タイル）
  const gamesFiltered = games
    .filter((g) => textMatch(g.rep) && playerMatch(g.rep) && genreMatch(g.rep))
    .sort((a, b) =>
      sort === "popular" ? b.likes - a.likes : b.newest - a.newest
    );
  return (
    <div className="catalog">
      <div className="search">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          className="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ゲーム名でさがす（例：宝石）"
          aria-label="ゲームをさがす"
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery("")}
            aria-label="検索をクリア"
          >
            ×
          </button>
        )}
      </div>

      {/* 人数で絞り込み（複数選択できる） */}
      <div className="filter-row">
        <span className="filter-label">人数</span>
        <div className="filter-chips" role="group" aria-label="人数でしぼる">
          <button
            type="button"
            className={"chip" + (players.length === 0 ? " is-on" : "")}
            onClick={() => setPlayers([])}
          >
            すべて
          </button>
          {PLAYER_BUCKETS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={players.includes(f.key)}
              className={"chip" + (players.includes(f.key) ? " is-on" : "")}
              onClick={() => togglePlayer(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ジャンル（システム）で絞り込み */}
      {genres.length > 0 && (
        <div className="filter-row">
          <span className="filter-label">ジャンル</span>
          <div className="filter-chips" role="group" aria-label="ジャンルでしぼる">
            <button
              type="button"
              className={"chip" + (genre === "all" ? " is-on" : "")}
              onClick={() => setGenre("all")}
            >
              すべて
            </button>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                className={"chip" + (genre === g ? " is-on" : "")}
                onClick={() => setGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 並び替え */}
      <div className="filter-row">
        <span className="filter-label">並び</span>
        <div className="filter-chips" role="group" aria-label="並び替え">
          <button
            type="button"
            className={"chip" + (sort === "new" ? " is-on" : "")}
            onClick={() => setSort("new")}
          >
            新着
          </button>
          <button
            type="button"
            className={"chip" + (sort === "popular" ? " is-on" : "")}
            onClick={() => setSort("popular")}
          >
            人気（❤️順）
          </button>
        </div>
      </div>

      {status === "loading" && <p className="hint">読み込み中…</p>}
      {status !== "loading" && gamesFiltered.length === 0 && (
        <p className="hint">条件に合うゲームが見つかりませんでした。</p>
      )}

      <div className="tiles">
        {gamesFiltered.map((g) => (
          <GameTile
            key={g.key}
            script={g.rep}
            count={g.list.length}
            onOpen={() =>
              g.list.length === 1
                ? setOpenId(g.list[0].id) // 台本が1本なら中間画面を飛ばして直行
                : setSelectedGame(g.key)
            }
          />
        ))}
      </div>
    </div>
  );
}

// 未ログインで台本作成を開いたときの案内。
function LoginPrompt({ onLogin }) {
  return (
    <div className="paywall">
      <span className="paywall-badge">ログインが必要</span>
      <h3 className="paywall-title">台本づくりにはログインが必要です</h3>
      <p className="paywall-lead">
        閲覧はログインなしでOK。台本の作成・投稿・いいねをするにはログインしてください。
      </p>
      <button className="savebtn" type="button" onClick={onLogin}>
        ログイン／新規登録
      </button>
    </div>
  );
}

// 台本づくりは有料プランの機能。無料の人にはこの案内を出す。
function Paywall({ onTryDemo }) {
  return (
    <div className="paywall">
      <span className="paywall-badge">PRO プラン</span>
      <h3 className="paywall-title">台本づくりは有料プランの機能です</h3>
      <p className="paywall-lead">
        まずは運営の台本を無料で使えます。自分のゲームの台本を作りたくなったら、有料プランへ。
      </p>
      <ul className="paywall-list">
        <li>自分のゲームの台本を作成・共有できる</li>
        <li>台本から早見表（サマリー）を自動生成・印刷</li>
        <li>PRO アイコンが解禁される</li>
      </ul>
      <button className="savebtn" type="button">
        有料プランについて
      </button>
      <button className="paywall-demo" type="button" onClick={onTryDemo}>
        （デモ）試しに使ってみる →
      </button>
    </div>
  );
}
