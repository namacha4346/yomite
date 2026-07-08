// 簡易アカウント（ニックネーム＝ハンドル）。
// 今はブラウザ内に保存するだけ。将来 Supabase 等の本物の認証に差し替える想定。
const KEY = "hub.user.v1";

export function getUser() {
  return localStorage.getItem(KEY) || "";
}
export function setUser(name) {
  const n = (name || "").trim().slice(0, 20);
  if (n) localStorage.setItem(KEY, n);
  else localStorage.removeItem(KEY);
  return n;
}
