// いいねの保存。台本ID → いいねした人（ハンドル）の配列。
// 今はブラウザ内（localStorage）に持つ。将来はDBに載せて全員で共有する。
const KEY = "hub.likes.v1";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}
function write(o) {
  localStorage.setItem(KEY, JSON.stringify(o));
}

export function likesOf(id) {
  return read()[id] || [];
}
export function likeCount(id) {
  return likesOf(id).length;
}
export function hasLiked(id, user) {
  return !!user && likesOf(id).includes(user);
}
// いいねを付け外しして、更新後の件数を返す
export function toggleLike(id, user) {
  if (!user) return likeCount(id);
  const o = read();
  const arr = o[id] || [];
  const i = arr.indexOf(user);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(user);
  o[id] = arr;
  write(o);
  return arr.length;
}
// その人がいいねした台本IDの一覧
export function likedIds(user) {
  if (!user) return [];
  const o = read();
  return Object.keys(o).filter((id) => o[id].includes(user));
}
