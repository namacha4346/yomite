import { iconsByCategory } from "./icons.js";

// 共通アイコン集から1つ選ぶ部品。カテゴリごとに見出しを付けて並べる。
// pro のアイコンは「有料アカウントで解禁」としてロック表示（Canva型の見本）。
// isPro=false（無料アカウント想定）だと pro アイコンは選べない。
export default function IconPicker({ value, onPick, isPro = false }) {
  return (
    <div className="picker" role="listbox" aria-label="アイコンを選ぶ">
      {iconsByCategory().map((group) => (
        <div className="picker-group" key={group.cat}>
          <div className="picker-cat">{group.cat}</div>
          <div className="picker-grid">
            {group.items.map((it) => {
              const locked = it.pro && !isPro;
              const selected = value === it.icon;
              return (
                <button
                  type="button"
                  key={it.icon}
                  role="option"
                  aria-selected={selected}
                  className={
                    "picker-item" +
                    (selected ? " is-selected" : "") +
                    (locked ? " is-locked" : "")
                  }
                  title={locked ? `${it.name}（有料アカウントで解禁）` : it.name}
                  onClick={() => !locked && onPick(it.icon)}
                  aria-disabled={locked}
                >
                  <span className="picker-emoji">{it.icon}</span>
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
