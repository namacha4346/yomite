// サマリーの保存。今はブラウザ内（localStorage）だけ。
// アカウント・課金・共有DBは「あとで」バックエンドに載せる（設計上の保留事項）。

const KEY = "hub.summaries.v1";

// 保存されている全サマリーを読む
export function loadSummaries() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 全サマリーを書き込む
function saveAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

// 1件追加して、更新後の一覧を返す
export function addSummary(summary) {
  const list = loadSummaries();
  const withId = { ...summary, id: crypto.randomUUID(), createdAt: Date.now() };
  const next = [withId, ...list];
  saveAll(next);
  return next;
}

// 1件削除して、更新後の一覧を返す
export function deleteSummary(id) {
  const next = loadSummaries().filter((s) => s.id !== id);
  saveAll(next);
  return next;
}
