import { isFollowing, toggleFollow } from "./follows.js";

// フォロー／フォロー中トグル。自分自身には出さない。
// 未ログインなら onNeedName（ログイン促し）。
export default function FollowButton({ handle, user, onNeedName, onChange }) {
  if (user && user === handle) return null; // 自分はフォローできない
  const following = isFollowing(handle, user);
  const click = () => {
    if (!user) {
      onNeedName && onNeedName();
      return;
    }
    toggleFollow(handle, user);
    onChange && onChange();
  };
  return (
    <button
      type="button"
      className={"follow-btn" + (following ? " is-on" : "")}
      onClick={click}
      aria-pressed={following}
    >
      {following ? "フォロー中" : "＋ フォロー"}
    </button>
  );
}
