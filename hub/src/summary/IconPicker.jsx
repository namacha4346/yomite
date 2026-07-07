import { ICON_LIBRARY } from "./icons.js";

// 共通アイコン集から1つ選ぶ部品。
// pro のアイコンは「有料アカウントで解禁」としてロック表示（Canva型の見本）。
// isPro=false（無料アカウント想定）だと pro アイコンは選べない。
export default function IconPicker({ value, onPick, isPro = false }) {
  return (
    <div className="picker" role="listbox" aria-label="アイコンを選ぶ">
      {ICON_LIBRARY.map((it) => {
        const locked = it.pro && !isPro;
        const selected = value === it.icon;
        return (
          <button
            type="button"
            key={it.icon}
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
  );
}
