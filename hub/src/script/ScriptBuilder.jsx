import { useState } from "react";
import { Link } from "react-router-dom";
import IconPicker from "../summary/IconPicker.jsx";
import { SECTIONS, THEMES } from "./sections.js";
import { MECHANICS } from "./mechanics.js";
import { emptyScript, isComplete, scriptToForm, DEFAULT_THEME_ORDER } from "./model.js";

// 台本エディタ。10セクションを「テーマごとのタブ」に分けて入力する。
// 手番=箇条書き、アイコン早見表=アイコン選択、他=長文。全項目必須（一言可）。
// initial を渡すと、その台本（公式のお勧め）を下敷きに「自分版」を編集できる（フォーク）。
export default function ScriptBuilder({ onSave, isPro = false, initial = null, onNewBlank }) {
  const [form, setForm] = useState(() =>
    initial ? scriptToForm(initial) : emptyScript()
  );
  const [pickerRow, setPickerRow] = useState(null);
  const [theme, setTheme] = useState(0); // 表示中のテーマ（並び順のインデックス）
  const [editOrder, setEditOrder] = useState(false);
  const [agreed, setAgreed] = useState(false); // 投稿規約への同意（法務対応）

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // 作者が決める「教える順番」（テーマの並び）
  const orderedThemes = form.themeOrder
    .map((id) => THEMES.find((t) => t.id === id))
    .filter(Boolean);
  const moveTheme = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= form.themeOrder.length) return;
    setForm((f) => {
      const next = f.themeOrder.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return { ...f, themeOrder: next };
    });
  };
  const resetOrder = () =>
    setForm((f) => ({ ...f, themeOrder: DEFAULT_THEME_ORDER.slice() }));
  const isDefaultOrder =
    form.themeOrder.length === DEFAULT_THEME_ORDER.length &&
    form.themeOrder.every((id, i) => id === DEFAULT_THEME_ORDER[i]);

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
    if (!canSave || !agreed) return;
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
      themeOrder: form.themeOrder.slice(),
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
    setAgreed(false);
  };

  // 1セクションの入力欄を描画
  const renderSection = (sec) => (
    <div className="field" key={sec.key}>
      <span className="field-label">{sec.label}</span>

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

  const current = orderedThemes[theme] || orderedThemes[0];
  const sectionsInTheme = SECTIONS.filter((s) => current.keys.includes(s.key));

  return (
    <div className="builder">
      {initial ? (
        <div className="fork-note">
          <div className="fork-note-main">
            <span className="fork-badge">自分版</span>
            <p className="fork-note-text">
              <b>「{initial.gameTitle}」</b>の運営のお勧めを下敷きに編集中。各項目を
              あなたのインスト用に書き換えて、自分の台本として保存できます（元の運営の台本はそのまま）。
            </p>
          </div>
          {onNewBlank && (
            <button type="button" className="linkbtn" onClick={onNewBlank}>
              最初から新規で作る
            </button>
          )}
        </div>
      ) : (
        <p className="builder-note">
          台本を書くと、<b>手番でできること・終了条件・アイコン早見表</b> から早見表（サマリー）が自動で作られます。
          全項目必須ですが、軽いゲームは「特になし」など一言でもOKです。
        </p>
      )}

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

      {/* 教える順番（テーマの並び）を作者が決める */}
      <div className="field">
        <div className="field-head">
          <span className="field-label">教える順番（タブの並び）</span>
          <button
            type="button"
            className="order-toggle"
            aria-expanded={editOrder}
            onClick={() => setEditOrder((v) => !v)}
          >
            {editOrder ? "並べ替えを閉じる" : "順番を変える"}
          </button>
        </div>
        {editOrder && (
          <div className="order-edit">
            <p className="order-edit-note">
              この順番でタブ（＝インストの流れ）が並び、台本に保存されます。早見表は末尾固定です。
            </p>
            <ol className="order-list">
              {orderedThemes.map((t, i) => (
                <li key={t.id}>
                  <span className="order-name">{t.label}</span>
                  <span className="order-moves">
                    <button
                      type="button"
                      onClick={() => moveTheme(i, -1)}
                      disabled={i === 0}
                      aria-label={`${t.label}を上へ`}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTheme(i, 1)}
                      disabled={i === orderedThemes.length - 1}
                      aria-label={`${t.label}を下へ`}
                    >
                      ▼
                    </button>
                  </span>
                </li>
              ))}
            </ol>
            {!isDefaultOrder && (
              <button type="button" className="linkbtn order-reset" onClick={resetOrder}>
                運営のおすすめ順にもどす
              </button>
            )}
          </div>
        )}
      </div>

      {/* テーマのタブ（作者が決めた順） */}
      <div className="wiz-tabs" role="tablist" aria-label="台本のテーマ">
        {orderedThemes.map((t, i) => (
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
          {theme + 1} / {orderedThemes.length}
        </span>
        <button
          type="button"
          className="addbtn"
          disabled={theme === orderedThemes.length - 1}
          onClick={() => setTheme((t) => Math.min(orderedThemes.length - 1, t + 1))}
        >
          次へ →
        </button>
      </div>

      <label className="agree">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span className="agree-text">
          この台本は<b>自分の言葉で書いたオリジナル</b>で、公式説明書などの文章・図・
          画像を転載していません。第三者の権利を侵害しないこと、運営がこの投稿を掲載・
          表示できることに同意します（
          <Link to="/terms">利用規約</Link>）。
        </span>
      </label>

      <button
        className="savebtn"
        onClick={handleSave}
        disabled={!canSave || !agreed}
      >
        この台本を保存
      </button>
      {!canSave ? (
        <p className="hint">
          全ての項目に入力してください（未入力のタブに印がつきます・一言でもOK）。
        </p>
      ) : (
        !agreed && (
          <p className="hint">保存するには、上のチェックにご同意ください。</p>
        )
      )}
    </div>
  );
}
