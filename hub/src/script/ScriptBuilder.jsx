import { useState } from "react";
import IconPicker from "../summary/IconPicker.jsx";
import { SECTIONS } from "./sections.js";
import { emptyScript, isComplete } from "./model.js";

// 台本エディタ。10セクション全部必須（テキストは一言でもOK）。
// ⑤手番=箇条書き、⑧アイコン早見表=アイコン選択、他=長文。
export default function ScriptBuilder({ onSave, isPro = false }) {
  const [form, setForm] = useState(emptyScript());
  const [pickerRow, setPickerRow] = useState(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // ⑤手番（箇条書き）
  const setTurn = (i, v) =>
    setForm((f) => ({ ...f, turn: f.turn.map((x, idx) => (idx === i ? v : x)) }));
  const addTurn = () => setForm((f) => ({ ...f, turn: [...f.turn, ""] }));
  const removeTurn = (i) =>
    setForm((f) => ({
      ...f,
      turn: f.turn.length > 1 ? f.turn.filter((_, idx) => idx !== i) : f.turn,
    }));

  // ⑧アイコン早見表
  const setIconMeaning = (i, v) =>
    setForm((f) => ({
      ...f,
      icons: f.icons.map((x, idx) => (idx === i ? { ...x, meaning: v } : x)),
    }));
  const setIconEmoji = (i, emoji) =>
    setForm((f) => ({
      ...f,
      icons: f.icons.map((x, idx) => (idx === i ? { ...x, icon: emoji } : x)),
    }));
  const addIcon = () =>
    setForm((f) => ({ ...f, icons: [...f.icons, { icon: "", meaning: "" }] }));
  const removeIcon = (i) =>
    setForm((f) => ({
      ...f,
      icons: f.icons.length > 1 ? f.icons.filter((_, idx) => idx !== i) : f.icons,
    }));

  const canSave = isComplete(form);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      gameTitle: form.gameTitle.trim(),
      about: form.about.trim(),
      win: form.win.trim(),
      setup: form.setup.trim(),
      flow: form.flow.trim(),
      turn: form.turn.map((t) => t.trim()).filter(Boolean),
      scoring: form.scoring.trim(),
      end: form.end.trim(),
      icons: form.icons.filter((g) => g.icon || g.meaning.trim()),
      special: form.special.trim(),
      pitfalls: form.pitfalls.trim(),
    });
    setForm(emptyScript());
    setPickerRow(null);
  };

  return (
    <div className="builder">
      <p className="builder-note">
        台本を書くと、<b>⑤手番・⑦終了条件・⑧アイコン</b> から早見表（サマリー）が自動で作られます。
        全項目必須ですが、軽いゲームは「特になし」など一言でもOKです。
      </p>

      <label className="field">
        <span className="field-label">ゲーム名</span>
        <input
          className="input"
          value={form.gameTitle}
          onChange={(e) => set("gameTitle", e.target.value)}
          placeholder="例：はじめての農場ゲーム"
        />
      </label>

      {SECTIONS.map((sec) => (
        <div className="field" key={sec.key}>
          <span className="field-label">
            {sec.no} {sec.label}
          </span>

          {sec.type === "text" && (
            <textarea
              className="input textarea"
              value={form[sec.key]}
              onChange={(e) => set(sec.key, e.target.value)}
              placeholder={sec.ph}
            />
          )}

          {sec.type === "list" && (
            <>
              {form.turn.map((a, i) => (
                <div className="row" key={i}>
                  <input
                    className="input"
                    value={a}
                    onChange={(e) => setTurn(i, e.target.value)}
                    placeholder={sec.ph}
                  />
                  <button type="button" className="rowdel" onClick={() => removeTurn(i)}>
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="addbtn" onClick={addTurn}>
                ＋ 行を追加
              </button>
            </>
          )}

          {sec.type === "icons" && (
            <>
              {form.icons.map((g, i) => (
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
            </>
          )}
        </div>
      ))}

      <button className="savebtn" onClick={handleSave} disabled={!canSave}>
        この台本を保存
      </button>
      {!canSave && (
        <p className="hint">
          全ての項目に何か入力してください（軽いゲームは「特になし」でもOK）。
        </p>
      )}
    </div>
  );
}
