import { useState } from "react";
import IconPicker from "./IconPicker.jsx";
import { SIDES } from "./model.js";

// セクションを「表／裏」どちらの面に載せるか選ぶ小さなトグル
function SideToggle({ value, onChange }) {
  return (
    <span className="sidetoggle" role="group" aria-label="表裏の割り当て">
      {SIDES.map((s) => (
        <button
          type="button"
          key={s.key}
          className={"sidebtn" + (value === s.key ? " is-on" : "")}
          onClick={() => onChange(s.key)}
        >
          {s.label}
        </button>
      ))}
    </span>
  );
}

// サマリー作成フォーム（ビルダー）。
// 必須3部品：手番でできること／アイコン早見表／終了条件（＋自由メモ）。
// 各セクションは表／裏どちらの面に載せるか選べる。
export default function Builder({ onSave, isPro = false }) {
  const [gameTitle, setGameTitle] = useState("");
  const [turnActions, setTurnActions] = useState([""]);
  const [icons, setIcons] = useState([{ icon: "", meaning: "" }]);
  const [endCondition, setEndCondition] = useState("");
  const [pickerRow, setPickerRow] = useState(null);

  // 各セクションの面（既定は定番の表裏構成）
  const [turnActionsSide, setTurnActionsSide] = useState("front");
  const [endConditionSide, setEndConditionSide] = useState("front");
  const [iconsSide, setIconsSide] = useState("back");

  // --- 手番でできること ---
  const setAction = (i, v) =>
    setTurnActions((a) => a.map((x, idx) => (idx === i ? v : x)));
  const addAction = () => setTurnActions((a) => [...a, ""]);
  const removeAction = (i) =>
    setTurnActions((a) => (a.length > 1 ? a.filter((_, idx) => idx !== i) : a));

  // --- アイコン早見表 ---
  const setIconMeaning = (i, v) =>
    setIcons((g) => g.map((x, idx) => (idx === i ? { ...x, meaning: v } : x)));
  const setIconEmoji = (i, emoji) =>
    setIcons((g) => g.map((x, idx) => (idx === i ? { ...x, icon: emoji } : x)));
  const addIcon = () => setIcons((g) => [...g, { icon: "", meaning: "" }]);
  const removeIcon = (i) =>
    setIcons((g) => (g.length > 1 ? g.filter((_, idx) => idx !== i) : g));

  const canSave =
    gameTitle.trim() &&
    turnActions.some((a) => a.trim()) &&
    endCondition.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      gameTitle: gameTitle.trim(),
      turnActions: turnActions.map((a) => a.trim()).filter(Boolean),
      icons: icons.filter((g) => g.icon || g.meaning.trim()),
      endCondition: endCondition.trim(),
      turnActionsSide,
      endConditionSide,
      iconsSide,
    });
    // 入力をリセット
    setGameTitle("");
    setTurnActions([""]);
    setIcons([{ icon: "", meaning: "" }]);
    setEndCondition("");
    setTurnActionsSide("front");
    setEndConditionSide("front");
    setIconsSide("back");
    setPickerRow(null);
  };

  return (
    <div className="builder">
      <p className="builder-note">
        各セクションの <b>表 / 裏</b> ボタンで、どちらの面に載せるかを選べます（表裏1枚のサマリーになります）。
      </p>

      <label className="field">
        <span className="field-label">ゲーム名</span>
        <input
          className="input"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          placeholder="例：はじめてのカードゲーム"
        />
      </label>

      {/* ① 手番でできること */}
      <div className="field">
        <div className="field-head">
          <span className="field-label">① 手番でできること</span>
          <SideToggle value={turnActionsSide} onChange={setTurnActionsSide} />
        </div>
        {turnActions.map((a, i) => (
          <div className="row" key={i}>
            <input
              className="input"
              value={a}
              onChange={(e) => setAction(i, e.target.value)}
              placeholder="例：🌾 畑から食料をとる"
            />
            <button type="button" className="rowdel" onClick={() => removeAction(i)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" className="addbtn" onClick={addAction}>
          ＋ 行を追加
        </button>
      </div>

      {/* ② アイコン早見表 */}
      <div className="field">
        <div className="field-head">
          <span className="field-label">② アイコン早見表</span>
          <SideToggle value={iconsSide} onChange={setIconsSide} />
        </div>
        {icons.map((g, i) => (
          <div className="iconrow" key={i}>
            <div className="row">
              <button
                type="button"
                className="iconslot"
                onClick={() => setPickerRow(pickerRow === i ? null : i)}
                title="アイコンを選ぶ"
              >
                {g.icon || "＋"}
              </button>
              <input
                className="input"
                value={g.meaning}
                onChange={(e) => setIconMeaning(i, e.target.value)}
                placeholder="このアイコンの意味（例：食料。人を養うのに使う）"
              />
              <button type="button" className="rowdel" onClick={() => removeIcon(i)}>
                ×
              </button>
            </div>
            {pickerRow === i && (
              <IconPicker
                value={g.icon}
                isPro={isPro}
                onPick={(emoji) => {
                  setIconEmoji(i, emoji);
                  setPickerRow(null);
                }}
              />
            )}
          </div>
        ))}
        <button type="button" className="addbtn" onClick={addIcon}>
          ＋ アイコンを追加
        </button>
        {!isPro && (
          <p className="hint">
            PRO のアイコンは有料アカウントで解禁できます（現在は見本）。
          </p>
        )}
      </div>

      {/* ③ 終了条件 */}
      <div className="field">
        <div className="field-head">
          <span className="field-label">③ 終了条件</span>
          <SideToggle value={endConditionSide} onChange={setEndConditionSide} />
        </div>
        <textarea
          className="input textarea"
          value={endCondition}
          onChange={(e) => setEndCondition(e.target.value)}
          placeholder="例：山札がなくなったら終了。⭐が一番多い人の勝ち。"
        />
      </div>

      <button className="savebtn" onClick={handleSave} disabled={!canSave}>
        このサマリーを保存
      </button>
      {!canSave && (
        <p className="hint">ゲーム名・手番でできること・終了条件は必須です。</p>
      )}
    </div>
  );
}
