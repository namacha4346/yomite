// サマリーの保存。バックエンド（/api/summaries）経由で「みんなで共有」する。
// 以前は localStorage（自分のブラウザ内だけ）だったが、サーバー保存に切替。

const API = "/api/summaries";

// 全件を取得
export async function listSummaries() {
  const r = await fetch(API);
  if (!r.ok) throw new Error("一覧の取得に失敗しました");
  return r.json();
}

// 1件追加 → 更新後の全件を返す
export async function createSummary(summary) {
  const r = await fetch(API, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(summary),
  });
  if (!r.ok) throw new Error("保存に失敗しました");
  return r.json();
}

// 1件削除 → 更新後の全件を返す
export async function removeSummary(id) {
  const r = await fetch(`${API}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error("削除に失敗しました");
  return r.json();
}
