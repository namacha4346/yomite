import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { gameColor } from "../ui/gameColor.js";

// 早見表の「自由レイアウト」編集の試作（PRO想定）。
// パワポのように、テキストボックスをドラッグで移動・幅リサイズ・文字サイズ変更でき、
// そのまま印刷／PDFにできる。表・裏の2面を切り替えて編集できる。
// レイアウトは端末内（localStorage）に自動保存する。

const uid = () => Math.random().toString(36).slice(2, 9);
const KEY = (id) => `bgh:layout:${id || "default"}`;

// 初期レイアウトを縦に積むとき、テキストの長さ・幅・文字サイズから
// おおよその高さ（キャンバス比の％）を見積もる。折り返す長い項目が
// 下のボックスと重ならないように、次のyをこのぶん進める。
// （A4縦・幅560px相当を基準にした概算。あくまで初期配置用。）
const CANVAS_W = 560;
const CANVAS_H = CANVAS_W * 1.414;
function estHeightPct(text, wPercent, size) {
  const boxW = CANVAS_W * (wPercent / 100);
  const perLine = Math.max(1, Math.floor(boxW / (size * 0.95))); // 1行に入る全角字数の概算
  const lines = Math.max(1, Math.ceil((text || "").length / perLine));
  const px = lines * size * 1.5; // line-height 1.5
  return (px / CANVAS_H) * 100;
}

// 設計幅(560px)基準のpxを、キャンバス幅に比例する cqw に変換する。
// これでスマホ幅でも文字が幅に応じて縮み、折り返し行数＝重なりが変わらない。
const cqw = (px) => (px / CANVAS_W) * 100 + "cqw";

// 表面：タイトル＋手番でできること＋終了条件
function frontBoxes(s) {
  const boxes = [];
  let y = 4;
  // add したテキストの見積もり高さ＋余白ぶん、自動で次のyを進める（重なり防止）
  const add = (x, w, size, bold, text, hang = 0, gap = 1.6) => {
    boxes.push({ id: uid(), x, y, w, size, bold, align: "left", indent: 0, hang, text });
    y += estHeightPct(text, w, size) + gap;
  };
  add(6, 88, 24, true, s.gameTitle || "（無題）", 0, 3);
  add(6, 88, 16, true, "手番でできること", 0, 1);
  // 番号つき項目は、折り返し行が本文の頭にそろうよう既定でぶら下げをつける
  (s.turn || []).filter(Boolean).forEach((t, i) => {
    add(8, 84, 12, false, `${i + 1}. ${t}`, 20, 2.4);
  });
  y += 2; // 終了条件の前に余白
  add(6, 88, 16, true, "終了条件", 0, 1);
  add(8, 84, 12, false, s.end || "");
  return boxes;
}

// 裏面：タイトル＋アイコン早見表（無ければ案内の1行だけ）
function backBoxes(s) {
  const boxes = [];
  let y = 4;
  const add = (x, w, size, bold, text, hang = 0, gap = 1.6) => {
    boxes.push({ id: uid(), x, y, w, size, bold, align: "left", indent: 0, hang, text });
    y += estHeightPct(text, w, size) + gap;
  };
  add(6, 88, 22, true, s.gameTitle || "（無題）", 0, 3);
  const icons = (s.icons || []).filter((g) => g.icon || g.meaning);
  if (icons.length) {
    add(6, 88, 16, true, "アイコン早見表", 0, 1);
    icons.forEach((g) => {
      add(8, 84, 11, false, `${g.icon} ${g.meaning}`, 20, 1.6);
    });
  } else {
    add(6, 88, 13, false, "（ここに裏面の内容を追加できます）");
  }
  return boxes;
}

function initialFaces(s) {
  return { front: frontBoxes(s), back: backBoxes(s) };
}

const FACE_LABEL = { front: "表", back: "裏" };

export default function LayoutEditor() {
  const [params] = useSearchParams();
  const id = params.get("script") || "splendor";
  const script = SAMPLE_SCRIPTS.find((s) => s.id === id) || SAMPLE_SCRIPTS[0];
  const ac = gameColor(script);

  // { front:[...], back:[...] } を端末内に保存。旧形式（配列）は表面として引き継ぐ。
  const [faces, setFaces] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY(id)));
      if (saved && Array.isArray(saved.front)) {
        return { front: saved.front, back: Array.isArray(saved.back) ? saved.back : backBoxes(script) };
      }
      if (Array.isArray(saved) && saved.length) {
        return { front: saved, back: backBoxes(script) };
      }
    } catch {
      /* 壊れていたら初期化 */
    }
    return initialFaces(script);
  });
  const [face, setFace] = useState("front"); // 編集中の面
  const [sel, setSel] = useState(null);
  const [preview, setPreview] = useState(false); // 編集UIを隠した仕上がり表示
  const [undo, setUndo] = useState(null); // { faces, label } 破壊的操作の取り消し用
  const canvasRef = useRef(null);
  const drag = useRef(null);

  // 取り消しバーは数秒で自動的に消す
  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 6000);
    return () => clearTimeout(t);
  }, [undo]);

  const boxes = faces[face];
  // 現在の面だけを更新する setBoxes 互換ラッパー
  const setBoxes = (updater) =>
    setFaces((f) => ({
      ...f,
      [face]: typeof updater === "function" ? updater(f[face]) : updater,
    }));

  // レイアウトを端末内に自動保存
  useEffect(() => {
    try {
      localStorage.setItem(KEY(id), JSON.stringify(faces));
    } catch {
      /* 保存不可の環境では何もしない */
    }
  }, [faces, id]);

  const update = (bid, patch) =>
    setBoxes((bs) => bs.map((b) => (b.id === bid ? { ...b, ...patch } : b)));
  const selBox = boxes.find((b) => b.id === sel);

  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dxp = ((e.clientX - d.sx) / d.W) * 100;
    const dyp = ((e.clientY - d.sy) / d.H) * 100;
    if (d.mode === "drag") {
      update(d.id, {
        x: Math.max(0, Math.min(96, d.x + dxp)),
        y: Math.max(0, Math.min(98, d.y + dyp)),
      });
    } else {
      update(d.id, { w: Math.max(10, Math.min(100 - d.x, d.w + dxp)) });
    }
  };
  const onUp = () => {
    drag.current = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };
  const onDown = (e, b, mode) => {
    e.preventDefault();
    setSel(b.id);
    const rect = canvasRef.current.getBoundingClientRect();
    drag.current = {
      id: b.id,
      mode,
      sx: e.clientX,
      sy: e.clientY,
      x: b.x,
      y: b.y,
      w: b.w,
      W: rect.width,
      H: rect.height,
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const switchFace = (s) => {
    setSel(null);
    setFace(s);
  };
  const addBox = () =>
    setBoxes((bs) => [
      ...bs,
      { id: uid(), x: 14, y: 12, w: 55, size: 14, bold: false, align: "left", indent: 0, hang: 0, text: "テキスト" },
    ]);
  const delBox = () => {
    if (!sel) return;
    setUndo({ faces, label: "1個削除しました" }); // 直前の状態を控えておく
    setBoxes((bs) => bs.filter((b) => b.id !== sel));
    setSel(null);
  };
  const reset = () => {
    setUndo({ faces, label: `${FACE_LABEL[face]}面を初期状態に戻しました` });
    setFaces((f) => ({ ...f, [face]: face === "front" ? frontBoxes(script) : backBoxes(script) }));
    setSel(null);
  };
  const doUndo = () => {
    if (!undo) return;
    setFaces(undo.faces); // 控えておいた状態に丸ごと戻す
    setUndo(null);
    setSel(null);
  };
  const doPrint = () => {
    setSel(null);
    setTimeout(() => window.print(), 60);
  };
  const openPreview = () => {
    setSel(null);
    setPreview(true);
  };

  // 1面のキャンバスを描画（editable のときだけ操作できる）
  const renderCanvas = (side) => {
    const editable = !preview && side === face;
    const active = side === face;
    return (
      <div
        className={"layout-sheet" + (active ? " is-active" : " is-inactive")}
        key={side}
      >
        {preview && <div className="layout-sheet-cap">{FACE_LABEL[side]}面</div>}
        <div
          className={"layout-canvas" + (preview ? " is-preview" : "")}
          ref={editable ? canvasRef : undefined}
          style={{ "--ac": ac }}
          onPointerDown={
            editable
              ? (e) => {
                  if (e.target === e.currentTarget) setSel(null);
                }
              : undefined
          }
        >
          {faces[side].map((b) => (
            <div
              key={b.id}
              className={"lbox" + (editable && b.id === sel ? " is-sel" : "")}
              style={{
                left: b.x + "%",
                top: b.y + "%",
                width: b.w + "%",
                fontSize: cqw(b.size),
                fontWeight: b.bold ? 800 : 400,
                textAlign: b.align,
              }}
              onPointerDown={editable ? (e) => onDown(e, b, "drag") : undefined}
            >
              <div
                className="lbox-text"
                style={{
                  paddingLeft: cqw((b.indent || 0) + (b.hang || 0)),
                  textIndent: cqw(-(b.hang || 0)),
                }}
              >
                {b.text || "　"}
              </div>
              {editable && b.id === sel && (
                <span
                  className="lbox-resize"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onDown(e, b, "resize");
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={"layout-page" + (preview ? " is-preview" : "")}>
      {preview ? (
        <div className="layout-previewbar">
          <button className="lt-btn" onClick={() => setPreview(false)}>
            ← 編集に戻る
          </button>
          <span className="layout-previewbar-label">仕上がりプレビュー（表・裏）</span>
          <button className="lt-btn lt-print" onClick={doPrint}>印刷／PDF</button>
        </div>
      ) : (
        <div className="layout-ui">
          <div className="layout-head">
            <Link to={`/learn?script=${id}`} className="page-back">
              ← 台本に戻る
            </Link>
            <span className="layout-title">
              早見表を自分好みに（PRO）— {script.gameTitle}
            </span>
          </div>

          <div className="face-switch layout-faces" role="tablist" aria-label="表裏の切替">
            {["front", "back"].map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={s === face}
                className={"face-switch-btn" + (s === face ? " is-on" : "")}
                onClick={() => switchFace(s)}
              >
                {FACE_LABEL[s]}面
              </button>
            ))}
          </div>

          <div className="layout-toolbar">
            <button className="lt-btn" onClick={addBox}>＋テキスト</button>
            <button className="lt-btn lt-preview" onClick={openPreview}>プレビュー</button>
            <button className="lt-btn lt-print" onClick={doPrint}>印刷／PDF</button>
            <button className="lt-btn lt-weak" onClick={reset}>この面をリセット</button>
            {selBox ? (
              <>
                <span className="lt-sep" aria-hidden="true" />
                <button className="lt-btn" onClick={() => update(sel, { size: Math.max(9, selBox.size - 1) })}>A−</button>
                <span className="lt-size">{selBox.size}px</span>
                <button className="lt-btn" onClick={() => update(sel, { size: Math.min(48, selBox.size + 1) })}>A＋</button>
                <button className={"lt-btn" + (selBox.bold ? " is-on" : "")} onClick={() => update(sel, { bold: !selBox.bold })}>B</button>
                <button className={"lt-btn" + (selBox.align === "left" ? " is-on" : "")} onClick={() => update(sel, { align: "left" })}>左</button>
                <button className={"lt-btn" + (selBox.align === "center" ? " is-on" : "")} onClick={() => update(sel, { align: "center" })}>中</button>
                <button className={"lt-btn" + (selBox.align === "right" ? " is-on" : "")} onClick={() => update(sel, { align: "right" })}>右</button>
                <span className="lt-sep" aria-hidden="true" />
                <span className="lt-grp">
                  <span className="lt-lbl">字下げ</span>
                  <button className="lt-btn" onClick={() => update(sel, { indent: Math.max(0, (selBox.indent || 0) - 6) })}>−</button>
                  <button className="lt-btn" onClick={() => update(sel, { indent: Math.min(140, (selBox.indent || 0) + 6) })}>＋</button>
                </span>
                <span className="lt-grp">
                  <span className="lt-lbl">ぶら下げ</span>
                  <button className="lt-btn" onClick={() => update(sel, { hang: Math.max(0, (selBox.hang || 0) - 6) })}>−</button>
                  <button className="lt-btn" onClick={() => update(sel, { hang: Math.min(140, (selBox.hang || 0) + 6) })}>＋</button>
                </span>
                <button className="lt-btn lt-del" onClick={delBox}>削除</button>
              </>
            ) : (
              <span className="lt-hint">ボックスをタップで選択 → 移動・幅・文字サイズを変更</span>
            )}
          </div>

          {selBox && (
            <textarea
              className="lt-text"
              value={selBox.text}
              onChange={(e) => update(sel, { text: e.target.value })}
              placeholder="テキストを入力"
            />
          )}
        </div>
      )}

      <div className="layout-stage">
        {["front", "back"].map((s) => renderCanvas(s))}
      </div>

      {undo && !preview && (
        <div className="lt-undo" role="status">
          <span className="lt-undo-msg">{undo.label}</span>
          <button className="lt-undo-btn" onClick={doUndo}>元に戻す</button>
        </div>
      )}
    </div>
  );
}
