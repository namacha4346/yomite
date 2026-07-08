// 台本ごとのコメント（デモ仕様：localStorage・非共有）。
// 本番では共有DB（comments テーブル）に差し替える。
const KEY = "hub.comments.v1";

// ごく簡単なNGワード（デモ用スタブ。本番はもっと網羅＋自動判定）
const NG_WORDS = ["死ね", "殺す", "ばか野郎", "きもい"];
export const NG_HINT = "不適切な表現が含まれています。";

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

// 表示用：通報済みを除き、いいね多い→新しい順
export function listComments(scriptId) {
  const all = read()[scriptId] || [];
  return all
    .filter((c) => !c.reported)
    .sort(
      (a, b) =>
        (b.likedBy?.length || 0) - (a.likedBy?.length || 0) ||
        (b.createdAt || 0) - (a.createdAt || 0)
    );
}
export function commentCount(scriptId) {
  return (read()[scriptId] || []).filter((c) => !c.reported).length;
}

// 追加。NGワード・空はエラーを返す
export function addComment(scriptId, user, text) {
  const body = (text || "").trim();
  if (!body) return { error: "コメントを入力してください。" };
  if (NG_WORDS.some((w) => body.includes(w))) return { error: NG_HINT };
  const o = read();
  const arr = o[scriptId] || [];
  arr.push({
    id: crypto.randomUUID(),
    user,
    text: body.slice(0, 500),
    createdAt: Date.now(),
    likedBy: [],
    reported: false,
  });
  o[scriptId] = arr;
  write(o);
  return { ok: true };
}

export function deleteComment(scriptId, id) {
  const o = read();
  o[scriptId] = (o[scriptId] || []).filter((c) => c.id !== id);
  write(o);
}

// 通報：デモでは即・非表示（本番は運営キューへ）
export function reportComment(scriptId, id) {
  const o = read();
  o[scriptId] = (o[scriptId] || []).map((c) =>
    c.id === id ? { ...c, reported: true } : c
  );
  write(o);
}

export function toggleCommentLike(scriptId, id, user) {
  if (!user) return;
  const o = read();
  o[scriptId] = (o[scriptId] || []).map((c) => {
    if (c.id !== id) return c;
    const arr = c.likedBy || [];
    const i = arr.indexOf(user);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(user);
    return { ...c, likedBy: arr };
  });
  write(o);
}
