// インストの「教える順番」を、閲覧者が自分好みに並べ替えて保存する。
// 公式（運営）の順番はあくまでデフォルト。ここは端末ごとの個人設定。
// 対象はテーマタブ（概要／準備・流れ／手番・得点・終了／アイコン・注意）。
// 早見表は参照用なので並べ替え対象に含めない（常に末尾）。
import { THEMES } from "./sections.js";

const KEY = "bgh:themeOrder";
const defaultOrder = () => THEMES.map((t) => t.id);

export function getThemeOrder() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!Array.isArray(raw)) return defaultOrder();
    // 既知のテーマだけ残し、足りないものは後ろに補う（定義変更に強くする）
    const valid = raw.filter((id) => THEMES.some((t) => t.id === id));
    for (const t of THEMES) if (!valid.includes(t.id)) valid.push(t.id);
    return valid;
  } catch {
    return defaultOrder();
  }
}

export function setThemeOrder(order) {
  try {
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* localStorage 不可の環境では無視 */
  }
}

export function resetThemeOrder() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function isDefaultOrder(order) {
  const d = defaultOrder();
  return order.length === d.length && order.every((id, i) => id === d[i]);
}
