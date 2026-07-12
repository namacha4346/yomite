import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SAMPLE_SCRIPTS } from "../script/samples.js";
import { gameColor } from "../ui/gameColor.js";

// 早見表の「自由レイアウト」編集の試作（PRO想定）。
// パワポのように、テキストボックスをドラッグで移動・幅リサイズ・文字サイズ変更でき、
// そのまま印刷／PDFにできる。まずは"表面のみ"のプロトタイプ。
// レイアウトは端末内（localStorage）に自動保存する。

const uid = () => Math.random().toString(36).slice(2, 9);
const KEY = (id) => `bgh:layout:${id || "default"}`;

// 台本から初期レイアウト（縦に積んだ状態）をつくる
function initialBoxes(s) {
  const boxes = [];
  let y = 4;
  const add = (x, w, size, bold, text) => {
    boxes.push({ id: uid(), x, y, w, size, bold, align: "left", text });
  };
  add(6, 88, 24, true, s.gameTitle || "（無題）");
  y += 9;
  add(6, 88, 16, true, "手番でできること");
  y += 6;
  (s.turn || []).filter(Boolean).forEach((t, i) => {
    add(8, 84, 12, false, `${i + 1}. ${t}`);
    y += 11;
  });
  y += 2;
  add(6, 88, 16, true, "終了条件");
  y += 6;
  add(8, 84, 12, false, s.end || "");
  return boxes;
}

export default function LayoutEditor() {
  const [params] = useSearchParams();
  const id = params.get("script") || "splendor";
  const script = SAMPLE_SCRIPTS.find((s) => s.id === id) || SAMPLE_SCRIPTS[0];
  const ac = gameColor(script);

  const [boxes, setBoxes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY(id)));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {
      /* 壊れていたら初期化 */
    }
    return initialBoxes(script);
  });
  const [sel, setSel] = useState(null);
  const [preview, setPreview] = useState(false); // 編集UIを隠した仕上がり表示
  const canvasRef = useRef(null);
  const drag = useRef(null);

  // レイアウトを端末内に自動保存
  useEffect(() => {
    try {
      localStorage.setItem(KEY(id), JSON.stringify(boxes));
    } catch {
      /* 保存不可の環境では何もしない */
    }
  }, [boxes, id]);

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

  const addBox = () =>
    setBoxes((bs) => [
      ...bs,
      { id: uid(), x: 14, y: 12, w: 55, size: 14, bold: false, align: "left", text: "テキスト" },
    ]);
  const delBox = () => {
    if (!sel) return;
    setBoxes((bs) => bs.filter((b) => b.id !== sel));
    setSel(null);
  };
  const reset = () => {
    setBoxes(initialBoxes(script));
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

  return (
    <div className={"layout-page" + (preview ? " is-preview" : "")}>
      {preview ? (
        <div className="layout-previewbar">
          <button className="lt-btn" onClick={() => setPreview(false)}>
            ← 編集にもどる
          </button>
          <span className="layout-previewbar-label">仕上がりプレビュー</span>
          <button className="lt-btn lt-print" onClick={doPrint}>印刷／PDF</button>
        </div>
      ) : (
      <div className="layout-ui">
        <div className="layout-head">
          <Link to={`/learn?script=${id}`} className="page-back">
            ← 台本にもどる
          </Link>
          <span className="layout-title">
            レイアウト編集（試作・PRO）— {script.gameTitle}
          </span>
        </div>

        <div className="layout-toolbar">
          <button className="lt-btn" onClick={addBox}>＋テキスト</button>
          <button className="lt-btn lt-preview" onClick={openPreview}>プレビュー</button>
          <button className="lt-btn lt-print" onClick={doPrint}>印刷／PDF</button>
          <button className="lt-btn" onClick={reset}>リセット</button>
          <span className="lt-sep" aria-hidden="true" />
          {selBox ? (
            <>
              <button className="lt-btn" onClick={() => update(sel, { size: Math.max(9, selBox.size - 1) })}>A−</button>
              <span className="lt-size">{selBox.size}px</span>
              <button className="lt-btn" onClick={() => update(sel, { size: Math.min(48, selBox.size + 1) })}>A＋</button>
              <button className={"lt-btn" + (selBox.bold ? " is-on" : "")} onClick={() => update(sel, { bold: !selBox.bold })}>B</button>
              <button className={"lt-btn" + (selBox.align === "left" ? " is-on" : "")} onClick={() => update(sel, { align: "left" })}>左</button>
              <button className={"lt-btn" + (selBox.align === "center" ? " is-on" : "")} onClick={() => update(sel, { align: "center" })}>中</button>
              <button className={"lt-btn" + (selBox.align === "right" ? " is-on" : "")} onClick={() => update(sel, { align: "right" })}>右</button>
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
        <div
          className={"layout-canvas" + (preview ? " is-preview" : "")}
          ref={canvasRef}
          style={{ "--ac": ac }}
          onPointerDown={(e) => {
            if (!preview && e.target === canvasRef.current) setSel(null);
          }}
        >
          {boxes.map((b) => (
            <div
              key={b.id}
              className={"lbox" + (!preview && b.id === sel ? " is-sel" : "")}
              style={{
                left: b.x + "%",
                top: b.y + "%",
                width: b.w + "%",
                fontSize: b.size + "px",
                fontWeight: b.bold ? 800 : 400,
                textAlign: b.align,
              }}
              onPointerDown={preview ? undefined : (e) => onDown(e, b, "drag")}
            >
              <div className="lbox-text">{b.text || "　"}</div>
              {!preview && b.id === sel && (
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
    </div>
  );
}
