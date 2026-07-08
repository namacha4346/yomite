import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ScriptCard from "../script/ScriptCard.jsx";
import SummaryCard from "../summary/SummaryCard.jsx";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { listScripts, removeScript } from "../script/store.js";
import { likedIds, likeCount } from "../social/likes.js";
import { followingList, followingCount, followerCount } from "../social/follows.js";
import FollowButton from "../social/FollowButton.jsx";
import { useAuth } from "../social/AuthContext.js";

// 個人プロフィールページ（X風）。/u/:handle
export default function Profile() {
  const { handle } = useParams();
  const { account, requireLogin } = useAuth();
  const isMe = account && account.handle === handle;

  const [shared, setShared] = useState([]);
  const [tab, setTab] = useState("posts"); // posts | likes
  const [printTarget, setPrintTarget] = useState(null);
  const [, setTick] = useState(0);
  const bump = () => setTick((t) => t + 1);

  useEffect(() => {
    listScripts()
      .then(setShared)
      .catch(() => setShared([]));
  }, []);

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

  const all = [
    ...SAMPLE_SCRIPTS.map((s) => ({ ...s, _group: "official" })),
    ...shared.map((s) => ({ ...s, _group: "shared" })),
  ];
  const posts = shared.filter((s) => s.author === handle);
  const totalLikes = posts.reduce((n, s) => n + likeCount(s.id), 0);
  const likedSet = new Set(isMe ? likedIds(handle) : []);
  const liked = all.filter((s) => likedSet.has(s.id));
  // フォロー中の作者の台本（自分のページのみ）
  const followingSet = new Set(isMe ? followingList(handle) : []);
  const feed = isMe ? shared.filter((s) => followingSet.has(s.author)) : [];

  const cardProps = {
    user: account ? account.handle : "",
    onNeedName: requireLogin,
    onPrint: setPrintTarget,
    onLikeChange: bump,
  };

  const handleDelete = async (id) => {
    try {
      setShared(await removeScript(id));
    } catch {
      /* noop */
    }
  };

  return (
    <div className="page page--learn">
      {/* X風のプロフィール見出し */}
      <div className="profile-head">
        <span className="profile-avatar" aria-hidden="true">
          {handle.slice(0, 1)}
        </span>
        <div className="profile-meta">
          <div className="profile-name-row">
            <h1 className="profile-name">
              {isMe && account.name ? account.name : handle}
            </h1>
            {!isMe && (
              <FollowButton
                handle={handle}
                user={account ? account.handle : ""}
                onNeedName={requireLogin}
                onChange={bump}
              />
            )}
          </div>
          <p className="profile-handle">@{handle}</p>
          <p className="profile-stats">
            フォロー中 <b>{followingCount(handle)}</b>　フォロワー{" "}
            <b>{followerCount(handle)}</b>　台本 <b>{posts.length}</b>　もらった❤️{" "}
            <b>{totalLikes}</b>
          </p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={"tab" + (tab === "posts" ? " is-active" : "")}
          onClick={() => setTab("posts")}
        >
          台本
        </button>
        {isMe && (
          <>
            <button
              className={"tab" + (tab === "likes" ? " is-active" : "")}
              onClick={() => setTab("likes")}
            >
              いいね
            </button>
            <button
              className={"tab" + (tab === "feed" ? " is-active" : "")}
              onClick={() => setTab("feed")}
            >
              フォロー中
            </button>
          </>
        )}
      </div>

      <div className="cards">
        {tab === "posts" &&
          (posts.length === 0 ? (
            <p className="hint">
              まだ台本がありません。
              {isMe && "「教わる／教える」→「台本をつくる」から投稿できます。"}
            </p>
          ) : (
            posts.map((s) => (
              <ScriptCard
                key={s.id}
                script={s}
                {...cardProps}
                onDelete={isMe ? handleDelete : undefined}
              />
            ))
          ))}

        {tab === "likes" &&
          (liked.length === 0 ? (
            <p className="hint">いいねした台本がここにたまります。</p>
          ) : (
            liked.map((s) => <ScriptCard key={s.id} script={s} {...cardProps} />)
          ))}

        {tab === "feed" &&
          (feed.length === 0 ? (
            <p className="hint">
              フォローした作者の新しい台本がここに並びます。作者のプロフィールから「＋フォロー」しよう。
            </p>
          ) : (
            feed.map((s) => <ScriptCard key={s.id} script={s} {...cardProps} />)
          ))}
      </div>

      <Link to="/learn" className="page-back">← 教わる／教える へ</Link>

      {printTarget && (
        <div className="print-sheet">
          <SummaryCard summary={printTarget} />
          <p className="print-foot">ボードゲームひろば（仮） — サマリー早見表</p>
        </div>
      )}
    </div>
  );
}
