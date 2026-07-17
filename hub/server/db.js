// サマリーの保存層（リポジトリ）。
// いまは JSON ファイルに保存。将来 SQLite / Postgres に差し替えるときは
// この4関数の中身だけ変えればよい（呼び出し側＝index.js は変えない）。
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");
const FILE = join(DATA_DIR, "summaries.json");

async function readAll() {
  if (!existsSync(FILE)) return [];
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeAll(list) {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

// 新しい順で全件返す
export async function list() {
  const all = await readAll();
  return all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// 1件追加して、更新後の全件を返す
export async function create(summary) {
  const all = await readAll();
  const item = {
    ...summary,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  all.push(item);
  await writeAll(all);
  return list();
}

// 1件削除して、更新後の全件を返す
export async function remove(id) {
  const all = await readAll();
  await writeAll(all.filter((s) => s.id !== id));
  return list();
}
