// アカウント（デモ仕様）。今はブラウザ内に1アカウントを保存するだけ。
// 本番では Supabase 等の認証に差し替える（handle＝ユーザーID相当）。
const KEY = "hub.account.v1";

export function getAccount() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}
export function saveAccount(account) {
  localStorage.setItem(KEY, JSON.stringify(account));
  return account;
}
export function clearAccount() {
  localStorage.removeItem(KEY);
}

// handle は英数と一部記号のみ・20文字まで
export function normalizeHandle(s) {
  return (s || "")
    .trim()
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, 20);
}
