// 台本の保存。バックエンド（/api/scripts）経由でみんなで共有する。
const API = "/api/scripts";

export async function listScripts() {
  const r = await fetch(API);
  if (!r.ok) throw new Error("一覧の取得に失敗しました");
  return r.json();
}

export async function createScript(script) {
  const r = await fetch(API, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(script),
  });
  if (!r.ok) throw new Error("保存に失敗しました");
  return r.json();
}

export async function removeScript(id) {
  const r = await fetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!r.ok) throw new Error("削除に失敗しました");
  return r.json();
}
