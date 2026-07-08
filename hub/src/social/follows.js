// フォロー（デモ仕様：localStorage・非共有）。
// 構造: { [フォローする人handle]: [フォローされる人handle, ...] }
// 本番では共有DB（follows テーブル）に差し替える。
const KEY = "hub.follows.v1";

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

export function isFollowing(target, user) {
  if (!user) return false;
  return (read()[user] || []).includes(target);
}
export function toggleFollow(target, user) {
  if (!user || user === target) return;
  const o = read();
  const arr = o[user] || [];
  const i = arr.indexOf(target);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(target);
  o[user] = arr;
  write(o);
}
export function followingList(user) {
  return read()[user] || [];
}
export function followingCount(user) {
  return followingList(user).length;
}
export function followerCount(target) {
  const o = read();
  return Object.values(o).filter((arr) => arr.includes(target)).length;
}
