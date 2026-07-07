// 台本の保存。通常はバックエンド（/api/scripts）経由でみんなで共有する。
// 1ファイルのデモ配布時（VITE_DEMO=1）は、サーバーを使わずブラウザ内（localStorage）に保存する。
const API = "/api/scripts";
const DEMO = import.meta.env.VITE_DEMO === "1";
const LS = "hub.scripts.demo";

function lsRead() {
  try {
    return JSON.parse(localStorage.getItem(LS)) || [];
  } catch {
    return [];
  }
}
function lsWrite(a) {
  localStorage.setItem(LS, JSON.stringify(a));
}
function lsList() {
  return [...lsRead()].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function listScripts() {
  if (DEMO) return lsList();
  const r = await fetch(API);
  if (!r.ok) throw new Error("一覧の取得に失敗しました");
  return r.json();
}

export async function createScript(script) {
  if (DEMO) {
    const a = lsRead();
    a.push({ ...script, id: crypto.randomUUID(), createdAt: Date.now() });
    lsWrite(a);
    return lsList();
  }
  const r = await fetch(API, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(script),
  });
  if (!r.ok) throw new Error("保存に失敗しました");
  return r.json();
}

export async function removeScript(id) {
  if (DEMO) {
    lsWrite(lsRead().filter((x) => x.id !== id));
    return lsList();
  }
  const r = await fetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!r.ok) throw new Error("削除に失敗しました");
  return r.json();
}
