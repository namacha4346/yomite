import { useState } from "react";
import IconPicker from "./IconPicker.jsx";

// サマリー作成フォーム（ビルダー）。
// 必須3部品：手番でできること／アイコン早見表／終了条件。
// isPro は「有料アカウントか」の仮フラグ（今はUIの見本用）。
export default function Builder({ onSave, isPro = false }) {
  const [gameTitle, setGameTitle] = useState("");
  const [turnActions, setTurnActions] = useState([""]);
  const [icons, setIcons] = useState([{ icon: "", meaning: "" }]);
  const [endCondition, setEndCondition] = useState("");
  const [pickerRow, setPickerRow] = useState(null); // 今アイコンを選んでいる行

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
    });
    // 入力をリセット
    setGameTitle("");
    setTurnActions([""]);
    setIcons([{ icon: "", meaning: "" }]);
    setEndCondition("");
    setPickerRow(null);
  };

  return (
    <div className="builder">
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
        <span className="field-label">① 手番でできること</span>
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
        <span className="field-label">② アイコン早見表</span>
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
      <label className="field">
        <span className="field-label">③ 終了条件</span>
        <textarea
          className="input textarea"
          value={endCondition}
          onChange={(e) => setEndCondition(e.target.value)}
          placeholder="例：山札がなくなったら終了。⭐が一番多い人の勝ち。"
        />
      </label>

      <button className="savebtn" onClick={handleSave} disabled={!canSave}>
        このサマリーを保存
      </button>
      {!canSave && (
        <p className="hint">ゲーム名・手番でできること・終了条件は必須です。</p>
      )}
    </div>
  );
}
