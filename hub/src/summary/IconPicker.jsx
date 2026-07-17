import { iconsByCategory } from "./icons.js";
import { LibIcon } from "../ui/graphics.jsx";

// 共通アイコン集から1つ選ぶ部品。カテゴリごとに見出しを付けて並べる。
// アイコンは無料/PROで同じもの。無料は使える量を限定、PRO で全解禁。
// isPro=false（無料アカウント想定）だと pro アイコンは選べない（ロック表示）。
export default function IconPicker({ value, onPick, isPro = false }) {
  return (
    <div className="picker" role="listbox" aria-label="アイコンを選ぶ">
      {iconsByCategory().map((group) => (
        <div className="picker-group" key={group.cat}>
          <div className="picker-cat">{group.cat}</div>
          <div className="picker-grid">
            {group.items.map((it) => {
              const locked = it.pro && !isPro;
              const selected = value === it.id;
              return (
                <button
                  type="button"
                  key={it.id}
                  role="option"
                  aria-selected={selected}
                  className={
                    "picker-item" +
                    (selected ? " is-selected" : "") +
                    (locked ? " is-locked" : "")
                  }
                  title={locked ? `${it.name}（PROで解禁）` : it.name}
                  onClick={() => !locked && onPick(it.id)}
                  aria-disabled={locked}
                >
                  <span className="picker-emoji">
                    <LibIcon value={it.id} />
                  </span>
                  {it.pro && <span className="picker-pro">PRO</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
