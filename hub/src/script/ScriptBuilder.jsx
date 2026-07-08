import { useState } from "react";
import IconPicker from "../summary/IconPicker.jsx";
import { SECTIONS, THEMES } from "./sections.js";
import { MECHANICS } from "./mechanics.js";
import { emptyScript, isComplete } from "./model.js";

// 台本エディタ。10セクションを「テーマごとのタブ」に分けて入力する。
// ⑤手番=箇条書き、⑧アイコン早見表=アイコン選択、他=長文。全項目必須（一言可）。
export default function ScriptBuilder({ onSave, isPro = false }) {
  const [form, setForm] = useState(emptyScript());
  const [pickerRow, setPickerRow] = useState(null);
  const [theme, setTheme] = useState(0); // 表示中のテーマ（タブ）

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

  // 各セクションが入力済みか（タブの「未入力」印に使う）
  const isFilled = (key) => {
    if (key === "turn") return form.turn.some((t) => t.trim());
    if (key === "icons") return form.icons.some((g) => g.icon || g.meaning.trim());
    return (form[key] || "").trim().length > 0;
  };
  const themeDone = (t) => t.keys.every(isFilled);

  const toggleMech = (m) =>
    setForm((f) => ({
      ...f,
      mechanics: f.mechanics.includes(m)
        ? f.mechanics.filter((x) => x !== m)
        : [...f.mechanics, m],
    }));

  const canSave = isComplete(form);

  const handleSave = () => {
    if (!canSave) return;
    const pmin = parseInt(form.playersMin, 10);
    const pmax = parseInt(form.playersMax, 10);
    const players =
      pmin > 0 && pmax > 0 ? { min: Math.min(pmin, pmax), max: Math.max(pmin, pmax) } : undefined;
    const t = parseInt(form.timeMin, 10);
    const time = t > 0 ? t : undefined;
    const mechanics = form.mechanics.length ? form.mechanics : undefined;
    onSave({
      gameTitle: form.gameTitle.trim(),
      ...(players ? { players } : {}),
      ...(time ? { time } : {}),
      ...(mechanics ? { mechanics } : {}),
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
    setTheme(0);
  };

  // 1セクションの入力欄を描画
  const renderSection = (sec) => (
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
  );

  const current = THEMES[theme];
  const sectionsInTheme = SECTIONS.filter((s) => current.keys.includes(s.key));

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

      {/* カタログ用のメタ情報（任意） */}
      <div className="field">
        <span className="field-label">人数・時間（任意・一覧に表示）</span>
        <div className="meta-row">
          <input
            className="input meta-num"
            type="number"
            min="1"
            value={form.playersMin}
            onChange={(e) => set("playersMin", e.target.value)}
            placeholder="最少"
            aria-label="最少人数"
          />
          <span className="meta-sep">〜</span>
          <input
            className="input meta-num"
            type="number"
            min="1"
            value={form.playersMax}
            onChange={(e) => set("playersMax", e.target.value)}
            placeholder="最多"
            aria-label="最多人数"
          />
          <span className="meta-unit">人</span>
          <input
            className="input meta-num"
            type="number"
            min="1"
            value={form.timeMin}
            onChange={(e) => set("timeMin", e.target.value)}
            placeholder="時間"
            aria-label="所要時間（分）"
          />
          <span className="meta-unit">分</span>
        </div>
      </div>

      {/* ジャンル（システム）タグ（任意・複数可） */}
      <div className="field">
        <span className="field-label">ジャンル（任意・複数可・一覧のしぼり込みに使う）</span>
        <div className="filter-chips">
          {MECHANICS.map((m) => (
            <button
              key={m}
              type="button"
              className={"chip" + (form.mechanics.includes(m) ? " is-on" : "")}
              onClick={() => toggleMech(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* テーマのタブ */}
      <div className="wiz-tabs" role="tablist" aria-label="台本のテーマ">
        {THEMES.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === theme}
            className={"wiz-tab" + (i === theme ? " is-on" : "")}
            onClick={() => setTheme(i)}
          >
            {t.label}
            {!themeDone(t) && <span className="wiz-dot" title="未入力あり" />}
          </button>
        ))}
      </div>

      {/* 選択中テーマの入力欄 */}
      <div className="wiz-panel">{sectionsInTheme.map(renderSection)}</div>

      {/* テーマ移動 */}
      <div className="wiz-nav">
        <button
          type="button"
          className="addbtn"
          disabled={theme === 0}
          onClick={() => setTheme((t) => Math.max(0, t - 1))}
        >
          ← 前へ
        </button>
        <span className="wiz-progress">
          {theme + 1} / {THEMES.length}
        </span>
        <button
          type="button"
          className="addbtn"
          disabled={theme === THEMES.length - 1}
          onClick={() => setTheme((t) => Math.min(THEMES.length - 1, t + 1))}
        >
          次へ →
        </button>
      </div>

      <button className="savebtn" onClick={handleSave} disabled={!canSave}>
        この台本を保存
      </button>
      {!canSave && (
        <p className="hint">
          全ての項目に入力してください（未入力のタブに印がつきます・一言でもOK）。
        </p>
      )}
    </div>
  );
}
