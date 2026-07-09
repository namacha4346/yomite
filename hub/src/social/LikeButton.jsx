import { likeCount, hasLiked, toggleLike } from "./likes.js";
import { Icon } from "../ui/graphics.jsx";

// いいねボタン（❤️＋件数）。user が無ければ onNeedName を呼ぶ。
export default function LikeButton({ id, user, onNeedName, onChange }) {
  const liked = hasLiked(id, user);
  const count = likeCount(id);
  const click = () => {
    if (!user) {
      onNeedName && onNeedName();
      return;
    }
    toggleLike(id, user);
    onChange && onChange();
  };
  return (
    <button
      type="button"
      className={"like" + (liked ? " is-on" : "")}
      onClick={click}
      aria-pressed={liked}
      aria-label={liked ? "いいねを取り消す" : "いいねする"}
    >
      <Icon name="heart" className="like-heart" />
      <span className="like-count">{count}</span>
    </button>
  );
}
