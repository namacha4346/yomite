import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { storage } from "./storage";

/* ============================================================
   ヨミテ — 盤面すごろく版
   画面=盤、音声に合わせてコマが5マスを進む
   一覧(検索・絞り込み) → 詳細(すごろく盤+音声インスト)
   ============================================================ */

const MECHANICS = [
  "ワーカープレイスメント", "デッキ・カード構築", "拡大再生産", "正体隠匿",
  "ブラフ", "パーティ", "協力", "半協力", "エリアマジョリティ",
  "セットコレクション", "競り・オークション", "タイル・ピース配置",
  "推理・推論", "記憶", "カードドラフト", "ダイスロール",
  "レガシー・キャンペーン", "コミュニケーション",
];

const TOKENS = [
  { c: "#8A5BA6", label: "世界観" },
  { c: "#D8553F", label: "ゴール" },
  { c: "#5C9A6B", label: "準備" },
  { c: "#3D7EA6", label: "手番の流れ" },
  { c: "#E2A032", label: "よくある勘違い" },
];

const COVER_COLOR = { snow: "#3E8A93", vermin: "#7E5666", vulture: "#D98A33" };

const GAMES = [
  {
    id: "nanjamonja", title: "ナンジャモンジャ", titleKana: "なんじゃもんじゃ",
    summary: "もふもふの新種に名前をつけて、再会した瞬間に早押し。記憶と瞬発力のパーティゲーム。",
    players: { min: 2, max: 6 }, time: { min: 10, max: 15 }, minAge: 4,
    mechanics: ["パーティ", "記憶"], cover: "snow",
    inst: {
      world: "雪深い森の奥に、ナンジャモンジャ族という不思議な生き物たちが住んでいます。見たこともない、もふもふした姿。あなたは彼らに初めて出会い、名前をつけてあげる発見者です。次々とあらわれる新顔を、誰より早く見分けられるでしょうか。",
      goal: "カードをいちばん多く集めた人が勝ちです。すでに名前のついた生き物がふたたび現れた瞬間に、誰より早くその名前を呼ぶことを狙います。山札がなくなったらゲーム終了、手元のカードが最も多い人の勝ちです。",
      setup: "カードをよく混ぜて、裏向きの山札にして場の中央に置きます。",
      flow: "手番の人が山札を1枚めくって表にします。初めて出た生き物なら、みんなで相談してその場で名前をつけます。すでに名前がついた生き物がまた出たら、いちばん早く正しい名前を言えた人が、それまでにめくられたカードの束をぜんぶもらいます。そして次の人の手番に移ります。",
      pitfalls: "名前は自由につけてかまいません。覚えやすくても、ふざけた名前でも大丈夫。早押しは、正しい名前を言えた人だけがカードを取れます。間違えても基本ペナルティはありません。",
    },
  },
  {
    id: "cockroach", title: "ごきぶりポーカー", titleKana: "ごきぶりぽーかー",
    summary: "嫌われ者をすました顔で押しつけ合う。本当か嘘かを見抜く心理戦。",
    players: { min: 2, max: 6 }, time: { min: 20, max: 20 }, minAge: 8,
    mechanics: ["パーティ", "ブラフ"], cover: "vermin",
    inst: {
      world: "テーブルの上を、ゴキブリやネズミ、コウモリといった嫌われ者たちが行き交います。誰も自分の手元には置いておきたくない。だからすました顔で、しれっと隣へ押しつけるのです。「これはネズミですよ」――その一言は、はたして本当か、それとも嘘か。",
      goal: "同じ種類のカードを4枚集めてしまった人が負けです。害虫を押しつけ合いながら、自分の前にカードがたまらないよう、最後まで生き残ることを目指します。手番でカードを出せなくなった人も負けです。",
      setup: "カードをよく混ぜて、全員に配りきります。配られたカードは自分の手札として持ちます。",
      flow: "手番の人は手札から1枚を裏向きで相手に差し出し、「これは◯◯です」と種類を宣言します。出された人は、それが本当か嘘かを当てます。当たれば差し出した人の前に、外せば受け取った人の前に、そのカードを表向きで置きます。受け取った人は中身をのぞいてから、別の人へ言い直して回すこともできます。",
      pitfalls: "宣言する種類は、本当でも嘘でもかまいません。受け取って中身を見たあと、わざと違う名前をつけて回すのも作戦のうちです。",
    },
  },
  {
    id: "geier", title: "ハゲタカのえじき", titleKana: "はげたかのえじき",
    summary: "獲物を狙うハゲタカの読み合い。数字の出し方ひとつで勝敗が決まる。",
    players: { min: 2, max: 6 }, time: { min: 15, max: 20 }, minAge: 8,
    mechanics: ["競り・オークション", "推理・推論"], cover: "vulture",
    inst: {
      world: "荒野の上空を、ハゲタカたちが旋回しています。狙うのは、地に横たわる獲物。みんなが一斉に舞い降りるなか、いちばん強い一羽だけがごちそうにありつけます。ただし、ときには腐った餌をつかまされることも。相手の出方を読み、いつ降りるかを見極める勝負です。",
      goal: "プラスの点数カードをできるだけ多く取り、マイナスを避けて、点数の合計をいちばん高くした人が勝ちです。全員の手札がなくなったらゲーム終了になります。",
      setup: "各プレイヤーは、1から15の数字カードを1組ずつ持ちます。中央の山には、プラスとマイナスの点数カードをまぜて裏向きに置きます。",
      flow: "点数カードを1枚めくって表にします。全員、自分の手札から数字を1枚選んで裏向きに出し、いっせいに表にします。プラスの点数なら、いちばん大きい数字を出した人がもらいます。マイナスの点数なら、いちばん小さい数字を出した人が引き取ります。なお、同じ数字を出した人どうしは相打ちで無効になり、次に強い人が対象になります。",
      pitfalls: "数字カードは一度出したら戻ってきません。15枚で15ラウンドです。同じ数字どうしは打ち消し合うので、あえて低い数字で譲るのも手になります。",
    },
  },
  {
    id: "wingspan", title: "ウイングスパン", titleKana: "ういんぐすぱん",
    summary: "森・草原・水辺に鳥を呼び寄せ、特殊能力を連鎖させて育てる、美しい拡大再生産ゲーム。",
    players: { min: 1, max: 5 }, time: { min: 40, max: 70 }, minAge: 10,
    mechanics: ["拡大再生産", "カードドラフト", "セットコレクション"], cover: "snow",
    inst: {
      world: "あなたは野鳥に魅せられた愛好家。森・草原・水辺という3つの生息地に、さまざまな鳥を呼び寄せていきます。鳥たちはそれぞれ特殊な力を持ち、置くほどに次の手番でできることが増えていく――美しいカードと、コツコツ育っていく手応えが魅力の、拡大再生産ゲームです。",
      goal: "4ラウンドを通して、得点をいちばん多く集めた人が勝ちです。点数は、呼び寄せた鳥・産んだ卵・集めたエサ・ボーナスカード・各ラウンドの目標など、いろいろな形で入ります。派手な一発より、少しずつ積み上げていく設計です。",
      setup: "各プレイヤーは個人ボードと、鳥カード5枚・ボーナスカード2枚・エサ5個を受け取ります。手元に残す鳥カード1枚につきエサを1個捨て、ボーナスカードは1枚だけ残します。場の中央には、エサを出す「バードフィーダー」、表向きの鳥カード3枚、そして4ラウンド分の目標を用意します。",
      flow: "自分の番には、次の4つから1つだけ行います。1つめ・鳥を出す：手札の鳥に必要なエサを払い、生息地のいちばん左の空きマスに置きます（右のマスに置くときは、追加で卵も払います）。2つめ・エサを取る：森の列で、バードフィーダーのサイコロからエサを得ます。3つめ・卵を産む：草原の列で、鳥の上に卵を置きます。4つめ・カードを引く：水辺の列で、鳥カードを引きます。エサ・卵・カードは、その列に並んだ鳥が多いほどたくさん得られ、鳥の特殊な力もこのとき発動します。手番はアクションキューブの数だけ行え、ラウンドごとに1つずつ減ります（1ラウンド目は8回、最後は5回）。",
      pitfalls: "行動は1手番に1つだけ。あれもこれもとやりたくなりますが、選んで動きます。鳥は左から順に置くとお得で、右に置くほど追加のコスト（卵やエサ）がかかります。鳥の力は色で発動のタイミングが違う（出したとき・行動したとき・他の人の番・ゲーム終了時）ので、アイコンの色を確かめましょう。",
    },
  },
];

const RATES = [
  { label: "ゆっくり", v: 0.8 }, { label: "ふつう", v: 0.98 }, { label: "はやい", v: 1.18 },
];
const INST_ORDER = ["world", "goal", "setup", "flow", "pitfalls"];
const SECTION_HINTS = {
  world: "どんな世界? 何が面白い? 引き込む導入",
  goal: "何を目指す? いつ終わって誰が勝つ?",
  setup: "ゲーム開始前にやること",
  flow: "自分の番に何をする?",
  pitfalls: "間違えやすい点・補足",
};
const SECTION_PALETTE = [
  "#8A5BA6", "#D8553F", "#5C9A6B", "#3D7EA6", "#E2A032",
  "#C2554E", "#4F8A73", "#9C6B3E", "#6B7FB0",
];
const SECTION_SUGGESTIONS = ["使うコンポーネント", "ラウンドの流れ", "得点計算", "特殊ルール", "終了条件"];

// 台本の項目は元々5つ固定だったが、ゲームの複雑さに応じて増減・並べ替えできるようにする。
// game.sections が無い（未編集の）ゲームは、従来の game.inst から既定の5項目を組み立てる。
function getSections(game) {
  if (Array.isArray(game.sections) && game.sections.length) return game.sections;
  return INST_ORDER.map((key, i) => ({
    id: key, label: TOKENS[i].label, color: TOKENS[i].c,
    body: (game.inst && game.inst[key]) || "",
  }));
}
function newSectionId() {
  return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const fmtPlayers = (p) => (p.min === p.max ? `${p.min}人` : `${p.min}〜${p.max}人`);
const fmtTime = (t) => (t.min === t.max ? `${t.min}分` : `${t.min}〜${t.max}分`);
const fmtAge = (a) => `${a}歳〜`;

function chunk(text) {
  const parts = text.split(/(?<=[。！？\n])/).map((s) => s.trim()).filter(Boolean);
  const out = [];
  for (const p of parts) {
    if (p.length > 60) out.push(...p.split(/(?<=、)/).map((s) => s.trim()).filter(Boolean));
    else out.push(p);
  }
  return out;
}

// 表示用：文（。！？）や改行ごとに行を分ける（読み上げには影響しない）
function splitLines(text) {
  return (text || "").split(/(?<=[。！？])|\n/).map((s) => s.trim()).filter(Boolean);
}

const FEMALE_HINTS = ["kyoko", "haruka", "ayumi", "nanami", "sayaka", "mizuki", "kanako", "tomoko", "sara", "o-ren", "female", "女性"];
const MALE_HINTS = ["otoya", "ichiro", "hattori", "daniel", "male", "男性"];
function chooseFemale(list) {
  if (!list.length) return null;
  const score = (v) => {
    const n = (v.name + " " + v.voiceURI).toLowerCase();
    if (FEMALE_HINTS.some((k) => n.includes(k))) return 3;
    if (MALE_HINTS.some((k) => n.includes(k))) return -2;
    if (n.includes("google")) return 1;
    return 0;
  };
  return [...list].sort((a, b) => score(b) - score(a))[0];
}

const reduceMotion =
  typeof window !== "undefined" && window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 読み上げエンジン ---------- */
function useNarrator() {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const [supported] = useState(!!synth);
  const [jaVoices, setJaVoices] = useState([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(0.98);
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  const voiceRef = useRef(null);
  const rateRef = useRef(0.98);
  const queueRef = useRef([]);
  const posRef = useRef(0);
  const keepAlive = useRef(null);
  const stoppedRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => { rateRef.current = rate; }, [rate]);

  useEffect(() => {
    if (!synth) return;
    const pick = () => {
      const all = synth.getVoices();
      const ja = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith("ja"));
      setJaVoices(ja);
      setVoiceURI((prev) => {
        if (prev && ja.some((v) => v.voiceURI === prev)) return prev;
        const chosen = chooseFemale(ja);
        return chosen ? chosen.voiceURI : ja[0] ? ja[0].voiceURI : "";
      });
    };
    pick();
    synth.onvoiceschanged = pick;
    return () => { synth.onvoiceschanged = null; synth.cancel(); };
  }, [synth]);

  useEffect(() => {
    voiceRef.current = jaVoices.find((v) => v.voiceURI === voiceURI) || null;
  }, [voiceURI, jaVoices]);

  const clearKeepAlive = () => {
    if (keepAlive.current) { clearInterval(keepAlive.current); keepAlive.current = null; }
  };
  const stopAudio = () => {
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch (e) {}
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
  };

  const stop = useCallback(() => {
    stoppedRef.current = true;
    clearKeepAlive();
    stopAudio();
    if (synth) synth.cancel();
    setPlaying(false); setPaused(false); setActive(null);
    queueRef.current = []; posRef.current = 0;
  }, [synth]);

  const step = useCallback(() => {
    if (stoppedRef.current) return;
    const q = queueRef.current;
    if (posRef.current >= q.length) {
      clearKeepAlive(); setPlaying(false); setPaused(false); return; // active は最後のマスに残す
    }
    const item = q[posRef.current];
    setActive(item.s);
    const advance = () => { posRef.current += 1; step(); };
    // 音声ファイルがあればそれを再生（無ければ下で Web Speech にフォールバック）
    if (item.type === "audio") {
      let a = audioRef.current;
      if (!a) { a = new Audio(); audioRef.current = a; }
      a.onended = advance;
      a.onerror = advance;
      a.src = item.url;
      a.playbackRate = rateRef.current;
      const p = a.play();
      if (p && p.catch) p.catch(advance);
      return;
    }
    if (!synth) { advance(); return; }
    const u = new SpeechSynthesisUtterance(item.t);
    u.lang = "ja-JP";
    if (voiceRef.current) u.voice = voiceRef.current;
    u.rate = rateRef.current;
    u.onend = advance;
    u.onerror = advance;
    synth.speak(u);
  }, [synth]);

  const startQueue = (items) => {
    if (synth) synth.cancel();
    stopAudio();
    stoppedRef.current = false;
    queueRef.current = items; posRef.current = 0;
    setPlaying(true); setPaused(false);
    clearKeepAlive();
    keepAlive.current = setInterval(() => {
      if (synth && synth.speaking && !synth.paused) { synth.pause(); synth.resume(); }
    }, 9000);
    step();
  };

  // audio は section.id をキーにした音声ファイルURL（任意）。無ければ Web Speech で読み上げる。
  const playAll = (sections, audio) => {
    const items = [];
    sections.forEach((sec, i) => {
      const url = audio && audio[sec.id];
      if (url) {
        items.push({ s: i, type: "audio", url });
      } else {
        items.push({ s: i, type: "tts", t: sec.label + "。" });
        chunk(sec.body).forEach((t) => items.push({ s: i, type: "tts", t }));
      }
    });
    startQueue(items);
  };
  const playSection = (sections, i, audio) => {
    const sec = sections[i];
    const url = audio && audio[sec.id];
    const items = url
      ? [{ s: i, type: "audio", url }]
      : [{ s: i, type: "tts", t: sec.label + "。" },
         ...chunk(sec.body).map((t) => ({ s: i, type: "tts", t }))];
    startQueue(items);
  };
  const pause = () => {
    if (audioRef.current && !audioRef.current.paused) { try { audioRef.current.pause(); } catch (e) {} }
    if (synth) synth.pause();
    setPaused(true);
  };
  const resume = () => {
    if (audioRef.current && audioRef.current.src && audioRef.current.paused) {
      const p = audioRef.current.play(); if (p && p.catch) p.catch(() => {});
    }
    if (synth) synth.resume();
    setPaused(false);
  };

  useEffect(() => () => stop(), [stop]);

  return { supported, jaVoices, voiceURI, setVoiceURI, rate, setRate,
    active, playing, paused, playAll, playSection, pause, resume, stop };
}

/* ============================ パーツ ============================ */
function Tri({ small }) {
  const s = small ? 9 : 13;
  return (<svg width={s} height={s} viewBox="0 0 10 10" aria-hidden>
    <path d="M1 0.5 L9 5 L1 9.5 Z" fill="currentColor" /></svg>);
}
function Pawn({ color }) {
  return (
    <svg className="pawn-svg" viewBox="0 0 24 30" aria-hidden>
      <ellipse cx="12" cy="27.5" rx="8.2" ry="2.1" fill="rgba(0,0,0,.28)" />
      <circle cx="12" cy="6" r="4.4" fill={color} />
      <path d="M8.1 9.4 Q12 11.6 15.9 9.4 L18.6 24 Q12 27 5.4 24 Z" fill={color} />
      <path d="M5.4 24 Q12 27 18.6 24 L18.6 25.7 Q12 28.7 5.4 25.7 Z" fill="rgba(0,0,0,.2)" />
      <circle cx="10.4" cy="5" r="1.2" fill="rgba(255,255,255,.5)" />
    </svg>
  );
}
function Flag() {
  return (<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
    <path d="M4 1.5 V14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M5 2.2 H13 L11 5 L13 7.8 H5 Z" fill="currentColor" /></svg>);
}
function MetaRow({ game, dark }) {
  return (
    <div className={"meta-row" + (dark ? " dark" : "")}>
      <span><b>{fmtPlayers(game.players)}</b></span><span className="dot" />
      <span>{fmtTime(game.time)}</span><span className="dot" />
      <span>{fmtAge(game.minAge)}</span>
    </div>
  );
}
function Tags({ list }) {
  return (<div className="tags">{list.map((m) => <span key={m} className="tag">{m}</span>)}</div>);
}
function Cover({ theme, title, hero }) {
  return (<div className={"cover " + theme + (hero ? " hero" : "")}>
    <span className="cv-title">{title}</span></div>);
}

/* ---------- すごろく盤（詳細の主役） ---------- */
function Track({ game, sections, nar }) {
  const themeColor = COVER_COLOR[game.cover];
  const nodeRefs = useRef([]);
  const [centers, setCenters] = useState([]);
  const active = nar.active;

  const measure = useCallback(() => {
    const cs = nodeRefs.current.map((n) => (n ? n.offsetTop + n.offsetHeight / 2 : 0));
    setCenters(cs);
  }, []);

  useLayoutEffect(() => {
    measure();
    const onR = () => measure();
    window.addEventListener("resize", onR);
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => window.removeEventListener("resize", onR);
  }, [measure, game.id]);

  useEffect(() => {
    if (active == null) return;
    const n = nodeRefs.current[active];
    if (n) n.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  }, [active]);

  const ready = centers.length === sections.length;
  const pieceY = ready ? (active == null ? centers[0] : centers[active]) : 0;
  const lineTop = ready ? centers[0] : 0;
  const lineH = ready ? centers[centers.length - 1] - centers[0] : 0;

  return (
    <div className="track">
      <div className="rail-line" style={{ top: lineTop, height: lineH }} />
      <div className="piece" style={{ top: pieceY, opacity: ready ? 1 : 0 }}>
        <Pawn color={themeColor} />
      </div>

      {sections.map((sec, i) => {
        const on = active === i;
        const reached = active != null && i <= active;
        const last = i === sections.length - 1;
        return (
          <div className={"station" + (on ? " on" : "")} key={sec.id}>
            <div className="node" ref={(el) => (nodeRefs.current[i] = el)}
              style={{ borderColor: sec.color, background: reached ? sec.color : "#FCF5E3", color: reached ? "#fff" : sec.color }}>
              {last ? <Flag /> : <span>{i + 1}</span>}
            </div>
            <div className="station-card"
              style={on ? { borderColor: sec.color, boxShadow: `0 14px 30px -20px ${sec.color}` } : undefined}>
              <div className="sc-head">
                <h3 style={on ? { color: sec.color } : undefined}>{sec.label}</h3>
                <button className="read" style={{ color: sec.color, borderColor: sec.color }}
                  onClick={() => nar.playSection(sections, i, game.audio)} aria-label={sec.label + "を読む"}>
                  <Tri small /> 読む
                </button>
              </div>
              <p className="sc-text">
                {splitLines(sec.body).map((ln, k) => <span key={k}>{ln}</span>)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- ルールQ&A（AIがそのゲームのルールだけを根拠に答える） ---------- */
function buildSystem(game) {
  const rules = getSections(game).map((s) => `■${s.label}: ${s.body}`).join("\n");
  return `あなたはボードゲーム「${game.title}」のルール案内役です。下の【ルール】に書かれている内容だけを根拠に、プレイヤーの質問へ日本語で答えてください。

守ること:
- 根拠は【ルール】本文のみ。一般的なボードゲームの知識や、他のゲームのルールで補わない。
- 数・人数・回数・条件は、【ルール】本文の表現をそのまま優先する（勝手に言い換えたり丸めたりしない）。
- 【ルール】に書かれていないこと・はっきりしないことは推測せず、「このルールには書かれていないようです」と正直に答える。あいまいなまま断定しない。
- 2〜4文くらいで、やさしく簡潔に。必要なら短い箇条書きも可。
- 終始、ゲームマスターのような、落ち着いて親しみやすい一貫した口調で。
- 「公式ルールブックを確認してください」という注意書きは不要（アプリ側で表示済み）。

【ルール】
${rules}`;
}

const QA_SUGGESTIONS = ["何人で遊べる?", "勝つ条件は?", "準備ですることは?", "よくある勘違いは?"];

function QAPanel({ game }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const logRef = useRef(null);
  const color = COVER_COLOR[game.cover];

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, loading]);

  const ask = async (text) => {
    const question = (text || "").trim();
    if (!question || loading) return;
    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: buildSystem(game),
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const answer = (data.content || [])
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("").trim() || "うまく答えられませんでした。質問を少し変えてみてください。";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e) {
      setErr("つながりませんでした。少し待って、もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qa">
      <p className="qa-intro">
        プレイ中の「これってどうだっけ?」に、<b>{game.title}</b>のルールから答えます。
      </p>

      <div className="qa-log" ref={logRef}>
        {messages.length === 0 && !loading && (
          <div className="qa-empty">
            <Pawn color={color} />
            <span>気になることを聞いてください。</span>
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={"bubble-row " + m.role}>
            {m.role === "assistant" && (
              <span className="avatar" style={{ background: color }}><Pawn color="#fff" /></span>
            )}
            <div className={"bubble " + m.role}
              style={m.role === "user" ? { background: color } : undefined}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="bubble-row assistant">
            <span className="avatar" style={{ background: color }}><Pawn color="#fff" /></span>
            <div className="bubble assistant"><span className="dots"><i /><i /><i /></span></div>
          </div>
        )}
      </div>

      {err && <div className="qa-err">{err}</div>}

      {messages.length === 0 && (
        <div className="qa-sugs">
          {QA_SUGGESTIONS.map((s) => (
            <button key={s} className="sug" onClick={() => ask(s)} disabled={loading}>{s}</button>
          ))}
        </div>
      )}

      <div className="qa-input">
        <input type="text" value={input} disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") ask(input); }}
          placeholder="ルールについて質問する" aria-label="ルールについて質問する" />
        <button className="qa-send" onClick={() => ask(input)} disabled={loading || !input.trim()}
          style={{ background: color }} aria-label="質問する">
          <Tri />
        </button>
      </div>

      <p className="qa-note">※ このゲームのルールに書かれていることだけを参照して答えます。書かれていないことは「書かれていない」とお答えします。</p>
    </div>
  );
}

/* ---------- 紙芝居（初心者向け・手番をコマの動きで見せる） ---------- */
const STORYBOARDS = {
  nanjamonja: {
    chapters: [
      { label: "どんなゲーム?", frames: [
        { kind: "intro", creature: "#5C9A6B", cap: "雪の森にすむ、もふもふの不思議な生き物「ナンジャモンジャ族」。12種類が、めくるたびに次々あらわれます。" },
        { kind: "think", creature: "#5C9A6B", cap: "出てきた生き物には、その場でみんなが自由に名前をつけます。覚えやすくても、ふざけた名前でもOK。" },
        { kind: "burst", creature: "#5C9A6B", cap: "同じ子にまた出会ったら、いちばん早く名前を呼んだ人が札をもらえる。記憶と瞬発力の勝負です。" },
      ]},
      { label: "準備とゴール", frames: [
        { kind: "deck", cap: "準備：カードをよく混ぜて、裏向きの山札にして中央に置きます。" },
        { kind: "spotlight", win: true, cap: "ゴール：山札がなくなったとき、札をいちばん多く集めている人の勝ちです。" },
      ]},
      { label: "手番ですること", frames: [
        { kind: "deck", flip: true, creature: "#5C9A6B", cap: "手番の人が、山札から1枚めくります。" },
        { kind: "think", creature: "#5C9A6B", cap: "はじめて出た生き物なら、みんなで相談して名前をつけます。「もりお！」" },
        { kind: "burst", creature: "#5C9A6B", cap: "前に名前をつけた生き物が、もう一度あらわれた！" },
        { kind: "take", cap: "いちばん早く名前を呼べた人が、めくった札をぜんぶもらいます。" },
      ]},
      { label: "よくある勘違い", frames: [
        { kind: "note", cap: "名前は自由でOK。早押しは「正しい名前」を言えた人だけが札を取れます。" },
        { kind: "note", cap: "間違えて言ってしまっても、基本ペナルティはありません。どんどん挑戦して大丈夫。" },
      ]},
    ],
  },
  cockroach: {
    chapters: [
      { label: "どんなゲーム?", frames: [
        { kind: "intro", creature: "#7E5666", cap: "ゴキブリ、ネズミ、コウモリ…テーブルを行き交うのは、誰も持ちたくない8種類の嫌われ者。" },
        { kind: "pass", claim: "これは○○です", cap: "それを「これは○○です」と言って、すました顔で隣へ押しつけます。本当でも、嘘でも。" },
        { kind: "judge", cap: "言われた相手は、その言葉が本当か嘘かを見抜く。読み合いの心理戦です。" },
      ]},
      { label: "準備とゴール", frames: [
        { kind: "cards-row", n: 4, faceDown: true, pawns: true, cap: "準備：カードをよく混ぜて、全員に配りきります。" },
        { kind: "spotlight", lose: true, cap: "ゴール：同じ虫が自分の前に4枚そろうと負け。最後まで生き残った人の勝ちです。" },
      ]},
      { label: "手番ですること", frames: [
        { kind: "pass", claim: "これはネズミです", cap: "1枚を裏向きで差し出し、種類を宣言します。本当でも嘘でもOK。" },
        { kind: "judge", cap: "言われた人は「本当?」「嘘?」を当てます。" },
        { kind: "cards-row", n: 4, bug: true, hl: 3, hlPawn: true, cap: "外した人の前にカードが置かれます。" },
      ]},
      { label: "よくある勘違い", frames: [
        { kind: "note", cap: "宣言する種類は、本当でも嘘でもかまいません。" },
        { kind: "note", cap: "受け取って中を見たあと、わざと違う名前で次の人に回すのも作戦のうちです。" },
      ]},
    ],
  },
  geier: {
    chapters: [
      { label: "どんなゲーム?", frames: [
        { kind: "intro", value: "+10", color: "#C8902F", cap: "あなたは荒野のハゲタカ。狙うのは、場に置かれた点数という名の獲物です。" },
        { kind: "cards-row", numbers: [7, 12, 3, 9], cap: "全員がいっせいに数字を出し、いちばん強い一羽だけがごちそうにありつけます。" },
        { kind: "cards-row", numbers: [8, 8, 5, 2], strike: [0, 1], cap: "でも、ねらいが重なれば相打ち。相手の出方を読む、数字の読み合いです。" },
      ]},
      { label: "準備とゴール", frames: [
        { kind: "cards-row", numbers: [1, 2, 3, 4, 5], cap: "準備：各プレイヤーは1〜15の数字カードを1組ずつ持ちます。" },
        { kind: "spotlight", win: true, cap: "ゴール：手札を使い切ったとき、点数の合計がいちばん高い人の勝ちです。" },
      ]},
      { label: "手番ですること", frames: [
        { kind: "deck", flip: true, value: "+10", color: "#C8902F", cap: "場に点数カードを1枚めくります。" },
        { kind: "cards-row", numbers: [7, 12, 3, 9], cap: "全員、手札から数字を1枚、いっせいに出します。" },
        { kind: "cards-row", numbers: [7, 12, 3, 9], hl: 1, cap: "プラスの点数なら、いちばん大きい数字を出した人がもらいます。" },
        { kind: "cards-row", numbers: [8, 8, 5, 2], strike: [0, 1], cap: "同じ数字どうしは相打ちで無効。次に強い人へ。" },
      ]},
      { label: "よくある勘違い", frames: [
        { kind: "note", cap: "数字カードは一度出したら戻ってきません。15枚で15ラウンドです。" },
        { kind: "note", cap: "同じ数字どうしは打ち消し合うので、あえて低い数字で譲るのも手になります。" },
      ]},
    ],
  },
  wingspan: {
    chapters: [
      { label: "どんなゲーム?", frames: [
        { kind: "intro", creature: "#3D7EA6", cap: "あなたは野鳥の愛好家。森・草原・水辺に、さまざまな鳥を呼び寄せていきます。" },
        { kind: "wrow", habitats: [0, 1, 2], cap: "鳥にはそれぞれ特殊な力があり、置くほどに次の手番でできることが増えていきます。" },
      ]},
      { label: "準備とゴール", frames: [
        { kind: "wrow", habitats: [0, 1, 2, 1, 0], cap: "準備：各自、鳥カードとボーナスカード、エサを受け取って始めます。" },
        { kind: "spotlight", win: true, cap: "ゴール：4ラウンド後、鳥・卵・エサ・目標などの合計点がいちばん高い人の勝ちです。" },
      ]},
      { label: "手番ですること", frames: [
        { kind: "note", cap: "自分の番には、次の4つから1つだけ行います。" },
        { kind: "wplace", cap: "1つめ・鳥を出す：エサや卵を払って、生息地に鳥を置きます。" },
        { kind: "wfeed", habitat: 0, cap: "2つめ・エサを取る：森の列で、サイコロからエサを得ます。" },
        { kind: "wegg", habitat: 1, cap: "3つめ・卵を産む：草原の列で、鳥の上に卵を置きます。" },
        { kind: "wdraw", habitat: 2, cap: "4つめ・カードを引く：水辺の列で、鳥カードを引きます。" },
        { kind: "wscale", habitat: 0, n: 3, cap: "エサ・卵・カードは、その列に並んだ鳥が多いほどたくさんもらえます。鳥の力もこのとき発動します。" },
      ]},
      { label: "よくある勘違い", frames: [
        { kind: "note", cap: "行動は1手番に1つだけ。あれもこれもとはできません。" },
        { kind: "wcost", habitat: 0, cap: "鳥は左から順に置くとお得。右に置くほど追加コスト（卵やエサ）がかかります。" },
        { kind: "note", cap: "鳥の力は色で発動のタイミングが違います（出したとき・行動時・他の人の番・ゲーム終了時）。" },
      ]},
    ],
  },
};
const PLAYER_COLORS = ["#D8553F", "#3D7EA6", "#5C9A6B", "#E2A032"];

function SPawn({ x, y, s = 1, color }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="7.5" ry="2" fill="rgba(0,0,0,.16)" />
      <path d="M-6 0 Q-2 -15 0 -15 Q2 -15 6 0 Z" fill={color} />
      <circle cx="0" cy="-18" r="4.6" fill={color} />
      <circle cx="-1.6" cy="-19" r="1.1" fill="rgba(255,255,255,.5)" />
    </g>
  );
}
function Creature({ x, y, c, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0,-9 C7,-9 9,-3 9,2 C9,8 4,11 0,11 C-4,11 -9,8 -9,2 C-9,-3 -7,-9 0,-9 Z" fill={c} />
      <circle cx="-3.2" cy="0" r="2.1" fill="#fff" /><circle cx="3.2" cy="0" r="2.1" fill="#fff" />
      <circle cx="-3.2" cy="0.5" r="1" fill="#2a2017" /><circle cx="3.2" cy="0.5" r="1" fill="#2a2017" />
    </g>
  );
}
function Bug({ x, y, c, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={c} strokeWidth="1.5">
      <line x1="-7" y1="-4" x2="-12" y2="-7" /><line x1="7" y1="-4" x2="12" y2="-7" />
      <line x1="-7" y1="2" x2="-12" y2="2" /><line x1="7" y1="2" x2="12" y2="2" />
      <ellipse cx="0" cy="0" rx="7" ry="10" fill={c} stroke="none" />
      <line x1="0" y1="-9" x2="0" y2="9" stroke="rgba(0,0,0,.25)" strokeWidth="1.3" />
    </g>
  );
}
function SCard({ x, y, w = 34, h = 46, faceDown, hl, hlColor = "#333", rot = 0, strike, children }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="5"
        fill={faceDown ? "#c2a878" : "#fff"} stroke={hl ? hlColor : "#d8c8a4"} strokeWidth={hl ? 3 : 1.5} />
      {faceDown && <text x="0" y="6" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">?</text>}
      {children}
      {strike && (
        <g stroke="#D8553F" strokeWidth="3" strokeLinecap="round">
          <line x1={-w / 2 + 5} y1={-h / 2 + 5} x2={w / 2 - 5} y2={h / 2 - 5} />
          <line x1={w / 2 - 5} y1={-h / 2 + 5} x2={-w / 2 + 5} y2={h / 2 - 5} />
        </g>
      )}
    </g>
  );
}
function Bubble({ x, y, text, w = 92 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y="-15" width={w} height="26" rx="13" fill="#fff" stroke="#d8c8a4" strokeWidth="1.4" />
      <path d="M-5 9 L0 16 L5 9 Z" fill="#fff" stroke="#d8c8a4" strokeWidth="1.4" />
      <text x="0" y="3" textAnchor="middle" fontSize="11" fontWeight="700" fill="#33291c"
        fontFamily="'Zen Maru Gothic', sans-serif">{text}</text>
    </g>
  );
}
function Arrow({ x1, y1, x2, y2, c = "#8a7c5f" }) {
  const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return (
    <g stroke={c} fill={c}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="3" strokeLinecap="round" />
      <path d="M0 0 l-9 -4 l2 4 l-2 4 z" transform={`translate(${x2} ${y2}) rotate(${ang})`} stroke="none" />
    </g>
  );
}

/* ---- ウイングスパン専用パーツ（生息地3列・鳥カード・エサ皿・卵） ---- */
const HABITATS = [
  { key: "forest", label: "森", color: "#3F6B4E" },
  { key: "grass", label: "草原", color: "#C99A3B" },
  { key: "wetland", label: "水辺", color: "#3D7EA6" },
];
function BirdGlyph({ x, y, s = 1, c = "#4a3f2c" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
      <path d="M-8,3 C-8,-4 -2,-8 4,-7 C7,-7 9,-5 9,-3 C9,-1 6,0 6,0 C9,1 9,4 6,5 C2,7 -4,7 -8,3 Z" />
      <path d="M9,-4 L14,-2 L9,-1 Z" />
      <circle cx="1" cy="-4.5" r="1" fill="#fff" />
    </g>
  );
}
function WCard({ x, y, w = 46, h = 60, habitat = HABITATS[0], rot = 0, hl, hlColor, eggs = 0 }) {
  const bandH = 12;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="5"
        fill="#fff" stroke={hl ? (hlColor || habitat.color) : "#d8c8a4"} strokeWidth={hl ? 2.6 : 1.4} />
      <rect x={-w / 2 + 1.5} y={-h / 2 + 1.5} width={w - 3} height={bandH} rx="3" fill={habitat.color} />
      <BirdGlyph x={0} y={4} s={0.95} c="#4a3f2c" />
      {eggs > 0 && (
        <g transform={`translate(0 ${h / 2 - 9})`}>
          {Array.from({ length: eggs }).map((_, i) => (
            <ellipse key={i} cx={(i - (eggs - 1) / 2) * 10} cy="0" rx="3.6" ry="4.6"
              fill="#F3E9D2" stroke="#c9b585" strokeWidth="1" />
          ))}
        </g>
      )}
    </g>
  );
}
function DiePips({ c }) {
  return (
    <g>
      <rect x="-9" y="-9" width="18" height="18" rx="4" fill="#fff" stroke={c} strokeWidth="1.6" />
      <circle cx="-3.5" cy="-3.5" r="1.6" fill={c} /><circle cx="3.5" cy="3.5" r="1.6" fill={c} />
    </g>
  );
}
function EggIcon({ c }) { return <ellipse rx="7" ry="9" fill="#F3E9D2" stroke={c} strokeWidth="1.6" />; }
function CardBackIcon({ c }) { return <rect x="-8" y="-10" width="16" height="20" rx="3" fill={c} opacity=".85" />; }
function WBoard({ x, y, w = 190, highlight }) {
  const rowH = 30, gap = 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      {HABITATS.map((h, i) => {
        const ry = i * (rowH + gap);
        const isHl = highlight === i;
        return (
          <g key={h.key} transform={`translate(0 ${ry})`}>
            <rect x={-w / 2} y="0" width={w} height={rowH} rx="9"
              fill={isHl ? "#fff" : "#EFE4CA"} stroke={isHl ? h.color : "#d8c8a4"} strokeWidth={isHl ? 2.6 : 1.4} />
            <rect x={-w / 2} y="0" width="8" height={rowH} rx="4" fill={h.color} />
            <text x={-w / 2 + 18} y={rowH / 2 + 5} fontSize="12.5" fontWeight="700"
              fontFamily="'Zen Maru Gothic', sans-serif" fill="#4a3f2c">{h.label}</text>
            <g transform={`translate(${w / 2 - 20} ${rowH / 2})`}>
              {i === 0 && <DiePips c={h.color} />}
              {i === 1 && <EggIcon c={h.color} />}
              {i === 2 && <CardBackIcon c={h.color} />}
            </g>
          </g>
        );
      })}
    </g>
  );
}
function HabitatTag({ x, y, hi }) {
  const h = HABITATS[hi];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-30" y="-13" width="60" height="26" rx="13" fill={h.color} />
      <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff"
        fontFamily="'Zen Maru Gothic', sans-serif">{h.label}</text>
    </g>
  );
}
function DieFace({ x, y, r = 0, c = "#4a3f2c" }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x="-13" y="-13" width="26" height="26" rx="5" fill="#fff" stroke="#cdbf9e" strokeWidth="1.6" />
      <circle cx="-5" cy="-5" r="2.4" fill={c} /><circle cx="5" cy="5" r="2.4" fill={c} /><circle cx="0" cy="0" r="2.4" fill={c} />
    </g>
  );
}

function KamiScene({ frame, color }) {
  const f = frame;
  let content = null;

  if (f.kind === "deck") {
    content = (
      <g className="kami-pop">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={68 - i * 2} y={70 - i * 2} width="40" height="56" rx="5"
            fill="#cdb98e" stroke="#b89f72" strokeWidth="1.2" />
        ))}
        {f.flip && (
          <>
            <Arrow x1={122} y1={98} x2={168} y2={98} />
            <SCard x={206} y={98} hl hlColor={color}>
              {f.value
                ? <text x="0" y="7" textAnchor="middle" fontSize="17" fontWeight="700"
                    fill={f.color || color} fontFamily="'Bricolage Grotesque', sans-serif">{f.value}</text>
                : <Creature x={0} y={0} c={f.creature || color} />}
            </SCard>
          </>
        )}
      </g>
    );
  } else if (f.kind === "think") {
    content = (
      <g className="kami-pop">
        <SCard x={160} y={62} hl hlColor={color}><Creature x={0} y={0} c={f.creature || color} /></SCard>
        {[72, 160, 248].map((px, i) => (
          <g key={i}>
            <Bubble x={px} y={130} text={i === 1 ? "○○！" : "うーん"} w={58} />
            <SPawn x={px} y={182} s={1.4} color={PLAYER_COLORS[i]} />
          </g>
        ))}
      </g>
    );
  } else if (f.kind === "burst") {
    content = (
      <g className="kami-pop">
        <SCard x={118} y={84} rot={-7}><Creature x={0} y={0} c={f.creature || color} /></SCard>
        <SCard x={202} y={84} rot={7} hl hlColor={color}><Creature x={0} y={0} c={f.creature || color} /></SCard>
        <g transform="translate(160 52)"><circle r="16" fill={color} /><text y="7" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff">!</text></g>
        <Bubble x={160} y={140} text="○○！" w={58} />
        <SPawn x={160} y={184} s={1.5} color={color} />
      </g>
    );
  } else if (f.kind === "take") {
    content = (
      <g className="kami-pop">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={66} y={80 - i * 4} width="44" height="58" rx="5"
            fill="#fff" stroke="#d8c8a4" strokeWidth="1.4" />
        ))}
        <Arrow x1={120} y1={104} x2={206} y2={120} c={color} />
        <SPawn x={250} y={156} s={1.9} color={color} />
      </g>
    );
  } else if (f.kind === "intro") {
    content = (
      <g className="kami-pop">
        <SCard x={150} y={98} rot={-11} />
        <SCard x={172} y={98} rot={11} />
        <SCard x={161} y={94} hl hlColor={color}>
          {f.value
            ? <text x="0" y="7" textAnchor="middle" fontSize="16" fontWeight="700"
                fill={f.color || color} fontFamily="'Bricolage Grotesque', sans-serif">{f.value}</text>
            : <Creature x={0} y={0} c={f.creature || color} />}
        </SCard>
        <SPawn x={58} y={70} s={1.45} color={PLAYER_COLORS[0]} />
        <SPawn x={262} y={70} s={1.45} color={PLAYER_COLORS[1]} />
        <SPawn x={58} y={176} s={1.45} color={PLAYER_COLORS[2]} />
        <SPawn x={262} y={176} s={1.45} color={PLAYER_COLORS[3]} />
      </g>
    );
  } else if (f.kind === "spotlight") {
    content = (
      <g className="kami-pop">
        {f.win && (
          <g transform="translate(160 96)"><path d="M-17 7 L-17 -9 L-7 0 L0 -11 L7 0 L17 -9 L17 7 Z"
            fill="#E2A032" stroke="#C8902F" strokeWidth="1.3" /></g>
        )}
        {f.lose && (
          <g transform="translate(160 92)"><circle r="14" fill="#fff" stroke="#D8553F" strokeWidth="3" />
            <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#D8553F" strokeWidth="3" strokeLinecap="round" /></g>
        )}
        <SPawn x={160} y={158} s={2.6} color={f.lose ? "#7E5666" : (f.color || color)} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={230 - i * 3} y={118 - i * 3} width="34" height="46" rx="4"
            fill="#fff" stroke="#d8c8a4" strokeWidth="1.2" />
        ))}
      </g>
    );
  } else if (f.kind === "note") {
    content = (
      <g className="kami-pop">
        <rect x="64" y="44" width="192" height="112" rx="13" fill="#fff" stroke="#d8c8a4" strokeWidth="1.6" />
        <g transform="translate(92 72)"><circle r="15" fill={color} /><text y="7" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">!</text></g>
        <rect x="116" y="66" width="116" height="8" rx="4" fill="#e3d7bd" />
        <rect x="84" y="98" width="148" height="7" rx="3.5" fill="#ece2cb" />
        <rect x="84" y="114" width="120" height="7" rx="3.5" fill="#ece2cb" />
        <rect x="84" y="130" width="138" height="7" rx="3.5" fill="#ece2cb" />
      </g>
    );
  } else if (f.kind === "pass") {
    content = (
      <g className="kami-pop">
        <SPawn x={54} y={150} s={1.7} color={PLAYER_COLORS[0]} />
        <SPawn x={266} y={150} s={1.7} color={PLAYER_COLORS[1]} />
        <Bubble x={150} y={52} text={f.claim || "これは○○です"} w={132} />
        <SCard x={150} y={106} faceDown rot={-4} />
        <Arrow x1={120} y1={108} x2={214} y2={108} />
      </g>
    );
  } else if (f.kind === "judge") {
    content = (
      <g className="kami-pop">
        <SCard x={160} y={74} faceDown />
        <g transform="translate(106 152)"><rect x="-34" y="-16" width="68" height="32" rx="16" fill="#5C9A6B" /><text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">本当</text></g>
        <g transform="translate(214 152)"><rect x="-34" y="-16" width="68" height="32" rx="16" fill="#D8553F" /><text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">嘘</text></g>
      </g>
    );
  } else if (f.kind === "cards-row") {
    const items = f.numbers ? f.numbers : Array.from({ length: f.n || 4 });
    const N = items.length;
    const span = Math.min(66, 270 / N);
    const startX = 160 - ((N - 1) * span) / 2;
    content = (
      <g className="kami-pop">
        {items.map((it, i) => {
          const px = startX + i * span;
          const isHl = f.hl === i;
          const isStrike = f.strike && f.strike.includes(i);
          const dim = f.hl != null && !isHl;
          return (
            <g key={i} opacity={dim ? 0.45 : 1}>
              {f.pawns && <SPawn x={px} y={66} s={1.05} color={PLAYER_COLORS[i % 4]} />}
              <SCard x={px} y={f.pawns ? 128 : 108} faceDown={f.faceDown} hl={isHl} hlColor={color} strike={isStrike}>
                {f.numbers
                  ? <text x="0" y="7" textAnchor="middle" fontSize="20" fontWeight="700"
                      fill={isHl ? color : "#33291c"} fontFamily="'Bricolage Grotesque', sans-serif">{it}</text>
                  : f.bug ? <Bug x={0} y={0} c={PLAYER_COLORS[i % 4]} />
                  : (!f.faceDown ? <Creature x={0} y={0} c={PLAYER_COLORS[i % 4]} /> : null)}
              </SCard>
              {f.hlPawn && isHl && <SPawn x={px} y={158} s={1.15} color={color} />}
            </g>
          );
        })}
      </g>
    );
  } else if (f.kind === "wrow") {
    const list = f.habitats || [0, 1, 2];
    const n = list.length;
    const span = n >= 5 ? 46 : 78;
    const startX = 160 - ((n - 1) * span) / 2;
    content = (
      <g className="kami-pop">
        {list.map((hi, i) => (
          <WCard key={i} x={startX + i * span} y={100} habitat={HABITATS[hi]} rot={(i - (n - 1) / 2) * 6} />
        ))}
      </g>
    );
  } else if (f.kind === "wplace") {
    const row = f.row;
    const boardY = 46, rowH = 30, gap = 6;
    content = (
      <g className="kami-pop">
        <WBoard x={160} y={boardY} highlight={row} />
        {row == null ? (
          <>
            {[0, 1, 2].map((hi, i) => (
              <WCard key={hi} x={128 + i * 32} y={22} w={34} h={44} habitat={HABITATS[hi]} rot={(i - 1) * 10} />
            ))}
            <Arrow x1={160} y1={46} x2={160} y2={boardY - 4} c={color} />
          </>
        ) : (
          <>
            <WCard x={252} y={26} habitat={HABITATS[row]} hl hlColor={HABITATS[row].color} />
            <Arrow x1={238} y1={44} x2={208} y2={boardY + row * (rowH + gap) + rowH / 2} c={HABITATS[row].color} />
          </>
        )}
      </g>
    );
  } else if (f.kind === "wfeed") {
    const hi = f.habitat ?? 0;
    content = (
      <g className="kami-pop">
        <HabitatTag x={54} y={28} hi={hi} />
        <path d="M118,72 L202,72 L190,122 Q160,134 132,122 Z" fill="#EFE4CA" stroke="#cdbf9e" strokeWidth="1.6" />
        <DieFace x={144} y={92} r={-8} c={HABITATS[hi].color} />
        <DieFace x={178} y={94} r={10} c={HABITATS[hi].color} />
        <Arrow x1={202} y1={98} x2={248} y2={98} c={HABITATS[hi].color} />
        <g transform="translate(270 98)">
          <circle r="15" fill="#fff" stroke={HABITATS[hi].color} strokeWidth="2.4" />
          <circle r="5.5" fill={HABITATS[hi].color} />
        </g>
      </g>
    );
  } else if (f.kind === "wegg") {
    const hi = f.habitat ?? 1;
    content = (
      <g className="kami-pop">
        <HabitatTag x={54} y={28} hi={hi} />
        <WCard x={160} y={126} habitat={HABITATS[hi]} eggs={1} />
        <g transform="translate(160 58)"><ellipse rx="9" ry="12" fill="#F3E9D2" stroke="#c9b585" strokeWidth="1.6" /></g>
        <Arrow x1={160} y1={74} x2={160} y2={94} c={HABITATS[hi].color} />
      </g>
    );
  } else if (f.kind === "wdraw") {
    const hi = f.habitat ?? 2;
    content = (
      <g className="kami-pop">
        <HabitatTag x={54} y={28} hi={hi} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={68 - i * 2} y={92 - i * 2} width="40" height="56" rx="5"
            fill="#cdb98e" stroke="#b89f72" strokeWidth="1.2" />
        ))}
        <Arrow x1={122} y1={120} x2={168} y2={120} c={HABITATS[hi].color} />
        <WCard x={214} y={120} habitat={HABITATS[hi]} hl hlColor={HABITATS[hi].color} />
      </g>
    );
  } else if (f.kind === "wscale") {
    const hi = f.habitat ?? 0;
    const n = f.n || 3;
    const span = 60;
    const startX = 160 - ((n - 1) * span) / 2;
    content = (
      <g className="kami-pop">
        <HabitatTag x={54} y={28} hi={hi} />
        {Array.from({ length: n }).map((_, i) => {
          const px = startX + i * span;
          return (
            <g key={i}>
              <WCard x={px} y={132} w={40} h={54} habitat={HABITATS[hi]} />
              <g transform={`translate(${px} 62)`}>
                <circle r="12.5" fill="#fff" stroke={HABITATS[hi].color} strokeWidth="2.2" />
                <circle r="4.6" fill={HABITATS[hi].color} />
              </g>
              <Arrow x1={px} y1={75} x2={px} y2={104} c={HABITATS[hi].color} />
            </g>
          );
        })}
      </g>
    );
  } else if (f.kind === "wcost") {
    const hi = f.habitat ?? 0;
    const costs = [0, 1, 1, 2];
    content = (
      <g className="kami-pop">
        <HabitatTag x={54} y={28} hi={hi} />
        {costs.map((c, i) => {
          const px = 96 + i * 54;
          return (
            <g key={i}>
              <WCard x={px} y={118} w={40} h={54} habitat={HABITATS[hi]} />
              {c > 0 && (
                <g transform={`translate(${px} 80)`}>
                  {Array.from({ length: c }).map((_, j) => (
                    <circle key={j} cx={(j - (c - 1) / 2) * 10} cy="0" r="4.2" fill={HABITATS[hi].color} />
                  ))}
                </g>
              )}
            </g>
          );
        })}
        <Arrow x1={80} y1={154} x2={252} y2={154} c={HABITATS[hi].color} />
      </g>
    );
  }

  return (
    <svg viewBox="0 0 320 200" className="kami-svg" role="img" aria-label={f.cap}>
      <rect x="8" y="8" width="304" height="184" rx="18" fill="#E7D8BA" />
      {content}
    </svg>
  );
}

function Kamishibai({ game, nar }) {
  const sb = game.storyboard || STORYBOARDS[game.id];
  const color = COVER_COLOR[game.cover] || "#3E8A93";
  const [idx, setIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [chapsOverflow, setChapsOverflow] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const chapsRef = useRef(null);

  useLayoutEffect(() => {
    const el = chapsRef.current;
    if (!el) return;
    const check = () => setChapsOverflow(el.scrollWidth > el.clientWidth + 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  });

  const cancelSpeak = () => {
    try { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    if (audioRef.current) { try { audioRef.current.pause(); } catch (e) {} audioRef.current.onended = null; audioRef.current.onerror = null; }
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setSpeaking(false);
  };
  useEffect(() => () => cancelSpeak(), []);

  // 音声ファイル(url)があればそれを再生。無ければ Web Speech で読み上げる。
  const speak = (text, url) => {
    cancelSpeak();
    if (url) {
      let a = audioRef.current;
      if (!a) { a = new Audio(); audioRef.current = a; }
      setSpeaking(true);
      a.onended = () => setSpeaking(false);
      a.onerror = () => setSpeaking(false);
      a.src = url;
      a.playbackRate = nar.rate;
      const p = a.play();
      if (p && p.catch) p.catch(() => setSpeaking(false));
      return;
    }
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!nar.supported || !synth) return;
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    const v = nar.jaVoices.find((x) => x.voiceURI === nar.voiceURI);
    if (v) u.voice = v;
    u.rate = nar.rate;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.speak(u);
  };

  if (!sb) {
    return (
      <div className="kami">
        <div className="kami-empty">
          <Pawn color={color} />
          <p>この台本には、まだ紙芝居がありません。<br />（サンプルの3ゲームで体験できます）</p>
        </div>
      </div>
    );
  }

  // 章をフラットなコマ列に展開
  const flat = [];
  const starts = [];
  sb.chapters.forEach((c, ci) => {
    starts[ci] = flat.length;
    c.frames.forEach((fr) => flat.push({ ...fr, ch: ci }));
  });

  // 移動先の絵へ行き、その絵を1枚だけ読み上げる（自動では先に進まない）
  const goRead = (i) => {
    const t = Math.max(0, Math.min(flat.length - 1, i));
    setIdx(t);
    speak(flat[t].cap, flat[t].audio);
  };
  const goSilent = (i) => {
    cancelSpeak();
    setIdx(Math.max(0, Math.min(flat.length - 1, i)));
  };

  const f = flat[idx];
  const curCh = f.ch;
  const chCount = sb.chapters[curCh].frames.length;
  const posInCh = idx - starts[curCh];
  const isLast = idx === flat.length - 1;

  return (
    <div className="kami">
      <div className="kami-chaps-wrap">
        <div className="kami-chaps" ref={chapsRef}>
          {sb.chapters.map((c, i) => (
            <button key={i} className={"kchap" + (curCh === i ? " on" : "")}
              style={curCh === i ? { borderColor: color, color: color } : undefined}
              onClick={() => goSilent(starts[i])}>{c.label}</button>
          ))}
        </div>
        {chapsOverflow && <div className="kami-chaps-fade" aria-hidden="true" />}
      </div>

      <div className="kami-stage">
        {f.image
          ? <img key={idx} className="kami-img" src={f.image} alt={f.cap} />
          : <KamiScene key={idx} frame={f} color={color} />}
        {nar.supported && speaking && (
          <div className="kami-speaking" style={{ color }}>
            <span className="kspk"><i /><i /><i /></span>読み上げ中
          </div>
        )}
      </div>
      <p className="kami-cap">{f.cap}</p>

      <div className="kami-dots-row">
        {Array.from({ length: chCount }).map((_, i) => (
          <span key={i} className={"kdot" + (i === posInCh ? " on" : "")}
            style={i === posInCh ? { background: color } : undefined} />
        ))}
      </div>

      <div className="kami-steps">
        <button className="kstep back" onClick={() => goRead(idx - 1)} disabled={idx === 0}>◀ もどる</button>
        {isLast ? (
          <button className="kstep next" disabled style={{ background: "#cdbf9e" }}>これでおわり</button>
        ) : (
          <button className="kstep next" onClick={() => goRead(idx + 1)} style={{ background: color }}>
            確認して次へ ▶
          </button>
        )}
      </div>

      {nar.supported && (
        <button className="kami-replay" onClick={() => speak(f.cap, f.audio)}>
          <Tri small /> この絵をもう一度読む
        </button>
      )}
      <p className="kami-note">1枚ずつ読み上げます。「確認して次へ」を押すと、次の絵に進んで読み上げます。</p>
    </div>
  );
}

/* ---------- AIで紙芝居のコマ割りを生成 ---------- */
const KAMI_KINDS = {
  intro: "ゲーム全体の雰囲気。卓を囲むコマと中央の札。導入や概要に。",
  deck: "山札。flip:true で1枚めくった表向きカードを横に出す。value:\"+10\" で数字や点数も表示。めくる・引く動作に。",
  think: "コマたちが考える/相談する場面。命名・相談に。",
  burst: "「！」と同じ札2枚。再登場・気づき・早押しに。",
  take: "コマが札の山を引き寄せる。獲得・回収に。",
  pass: "コマからコマへ札を渡す。claim:\"これは○○です\" を吹き出しで表示。手渡し・宣言に。",
  judge: "裏向きの札と『本当/嘘』。真偽の判断・推測に。",
  "cards-row": "札を横一列に。numbers:[7,12,3,9] で数字、hl:1 で1枚強調、strike:[0,1] で相打ち、faceDown:true で裏向き、bug:true で虫、pawns:true で上にコマ。同時出し・比較・配り切りに。",
  spotlight: "主役のコマ。win:true で王冠（勝ち）、lose:true で✕（負け）。勝利・敗北条件に。",
  note: "注意メモ（！マーク）。よくある勘違いや補足に。",
};
const KAMI_KIND_KEYS = Object.keys(KAMI_KINDS);

function kamiSystem() {
  const kinds = KAMI_KIND_KEYS.map((k) => `- ${k}: ${KAMI_KINDS[k]}`).join("\n");
  return `あなたは、ボードゲームのインスト（ルール説明）を、初心者向けの「紙芝居」のコマ割りに変換する係です。
下の【台本】をもとに、4つの章に分けた紙芝居を作ってください。

章は必ずこの4つ・この順番・このラベルにします:
1. "どんなゲーム?"（世界観をもとに2〜3コマ。雰囲気 → 何をする → どこが面白い）
2. "準備とゴール"（準備で1コマ、勝利条件で1コマの計2コマ）
3. "手番ですること"（手番の流れを2〜4コマに分解。ここが一番大事）
4. "よくある勘違い"（1〜2コマ。kind は note を使う）

各コマは { "kind": ..., "cap": "..." } の形です。
- cap は読み上げる短い一文。やさしい日本語で、40字くらいまで。
- 【台本】に書かれていないルールや数字は足さない。説明しやすくするための並べ替え・要約だけを行い、作文しない。
- kind は次から、その場面に最も合うものを選びます:
${kinds}
- パラメータは必要なものだけ付けます（deck の flip/value、pass の claim、spotlight の win か lose、cards-row の numbers/hl/strike/faceDown/pawns/bug）。
- 迷ったら intro（場面）か note（メモ）を使います。

出力は JSON のみ。前置きやマークダウンの記号は付けないこと。形式:
{"chapters":[{"label":"...","frames":[{"kind":"...","cap":"..."}]}]}`;
}

function kamiUser(game) {
  const body = getSections(game).map((s) => `${s.label}: ${s.body}`).join("\n");
  return `【台本】
タイトル: ${game.title || "（無題）"}
${body}`;
}

function sanitizeStoryboard(raw) {
  if (!raw || !Array.isArray(raw.chapters)) return null;
  const chapters = raw.chapters.slice(0, 5).map((c) => {
    const label = typeof c.label === "string" && c.label.trim() ? c.label.trim() : "場面";
    const framesRaw = Array.isArray(c.frames) ? c.frames : [];
    const frames = framesRaw.slice(0, 8).map((fr) => {
      const kind = KAMI_KIND_KEYS.includes(fr.kind) ? fr.kind : "note";
      const out = { kind, cap: typeof fr.cap === "string" ? fr.cap : "" };
      if (kind === "deck") {
        if (fr.flip) out.flip = true;
        if (typeof fr.value === "string") out.value = fr.value;
      } else if (kind === "pass") {
        if (typeof fr.claim === "string") out.claim = fr.claim;
      } else if (kind === "spotlight") {
        if (fr.lose) out.lose = true; else out.win = true;
      } else if (kind === "cards-row") {
        if (Array.isArray(fr.numbers)) out.numbers = fr.numbers.filter((n) => typeof n === "number").slice(0, 6);
        if (typeof fr.n === "number") out.n = Math.max(2, Math.min(6, fr.n));
        if (fr.faceDown) out.faceDown = true;
        if (fr.pawns) out.pawns = true;
        if (fr.bug) out.bug = true;
        if (typeof fr.hl === "number") out.hl = fr.hl;
        if (Array.isArray(fr.strike)) out.strike = fr.strike.filter((n) => typeof n === "number");
      }
      return out;
    }).filter((fr) => fr.cap);
    return { label, frames };
  }).filter((c) => c.frames.length);
  return chapters.length ? { chapters } : null;
}

/* ---------- 台本エディタ（インスト者向け） ---------- */
const COVER_OPTS = [
  { v: "snow", label: "雪・森" },
  { v: "vermin", label: "暗がり" },
  { v: "vulture", label: "夕焼け" },
];
function Editor({ game, onPatch, onDuplicate, onDelete, onReset, isDefault, onShowKami, onRequestPrint }) {
  const sections = getSections(game);
  const patchSections = (next) => onPatch({ sections: next });
  const setSectionBody = (idx, val) => patchSections(sections.map((s, i) => (i === idx ? { ...s, body: val } : s)));
  const renameSection = (idx, val) => patchSections(sections.map((s, i) => (i === idx ? { ...s, label: val } : s)));
  const moveSection = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= sections.length) return;
    const next = sections.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    patchSections(next);
  };
  const removeSection = (idx) => {
    if (sections.length <= 1) return;
    patchSections(sections.filter((_, i) => i !== idx));
  };
  const addSection = (label) => {
    const color = SECTION_PALETTE[sections.length % SECTION_PALETTE.length];
    patchSections([...sections, { id: newSectionId(), label, color, body: "" }]);
  };
  const num = (v, fb) => { const n = parseInt(v, 10); return Number.isNaN(n) ? fb : n; };
  const toggleMech = (m) => {
    const has = game.mechanics.includes(m);
    onPatch({ mechanics: has ? game.mechanics.filter((x) => x !== m) : [...game.mechanics, m] });
  };

  const [genLoading, setGenLoading] = useState(false);
  const [genErr, setGenErr] = useState("");
  const generateKami = async () => {
    if (!sections.some((s) => s.body && s.body.trim())) {
      setGenErr("先に台本（とくに「手番の流れ」にあたる項目）を書いてください。");
      return;
    }
    setGenLoading(true);
    setGenErr("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: kamiSystem(),
          messages: [{ role: "user", content: kamiUser(game) }],
        }),
      });
      const data = await res.json();
      let text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("").trim();
      text = text.replace(/```json|```/g, "").trim();
      const s = text.indexOf("{");
      const e = text.lastIndexOf("}");
      if (s >= 0 && e > s) text = text.slice(s, e + 1);
      const sb = sanitizeStoryboard(JSON.parse(text));
      if (!sb) throw new Error("形式エラー");
      onPatch({ storyboard: sb });
      if (onShowKami) onShowKami();
    } catch (err) {
      setGenErr("うまく作れませんでした。もう一度お試しください。");
    } finally {
      setGenLoading(false);
    }
  };
  return (
    <div className="editor">
      <p className="ed-hint">ここで書いた内容は、すごろく・ルールQ&A・PDFにそのまま反映されます。変更は自動で保存されます。</p>

      <div className="ed-field">
        <label>タイトル</label>
        <input value={game.title} onChange={(e) => onPatch({ title: e.target.value })} placeholder="ゲーム名" />
      </div>
      <div className="ed-field">
        <label>よみがな<span className="ed-opt">検索用・任意</span></label>
        <input value={game.titleKana} onChange={(e) => onPatch({ titleKana: e.target.value })} placeholder="ひらがな" />
      </div>
      <div className="ed-field">
        <label>概要<span className="ed-opt">一覧に出る一言</span></label>
        <textarea rows={2} value={game.summary} onChange={(e) => onPatch({ summary: e.target.value })}
          placeholder="どんなゲーム? を一言で" />
      </div>

      <div className="ed-grid">
        <div className="ed-field"><label>人数</label>
          <div className="ed-pair">
            <input type="number" min="1" value={game.players.min}
              onChange={(e) => onPatch({ players: { ...game.players, min: num(e.target.value, 1) } })} />
            <span>〜</span>
            <input type="number" min="1" value={game.players.max}
              onChange={(e) => onPatch({ players: { ...game.players, max: num(e.target.value, 1) } })} />
          </div>
        </div>
        <div className="ed-field"><label>時間（分）</label>
          <div className="ed-pair">
            <input type="number" min="1" value={game.time.min}
              onChange={(e) => onPatch({ time: { ...game.time, min: num(e.target.value, 1) } })} />
            <span>〜</span>
            <input type="number" min="1" value={game.time.max}
              onChange={(e) => onPatch({ time: { ...game.time, max: num(e.target.value, 1) } })} />
          </div>
        </div>
      </div>

      <div className="ed-field"><label>対象年齢（◯歳から）</label>
        <input className="ed-narrow" type="number" min="0" value={game.minAge}
          onChange={(e) => onPatch({ minAge: num(e.target.value, 0) })} />
      </div>

      <div className="ed-field"><label>カバーの色味</label>
        <div className="ed-covers">
          {COVER_OPTS.map((c) => (
            <button key={c.v} className={"ed-cover " + c.v + (game.cover === c.v ? " on" : "")}
              onClick={() => onPatch({ cover: c.v })}>{c.label}</button>
          ))}
        </div>
      </div>

      <div className="ed-field"><label>メカニクス</label>
        <div className="ed-mechs">
          {MECHANICS.map((m) => (
            <button key={m} className={"mchip" + (game.mechanics.includes(m) ? " on" : "")}
              onClick={() => toggleMech(m)}>{m}</button>
          ))}
        </div>
      </div>

      <div className="ed-sep">台本（読み上げる項目）
        <span className="ed-sep-note">ゲームの複雑さに合わせて、項目を追加・削除・並べ替えできます</span>
      </div>
      {sections.map((sec, i) => (
        <div className="ed-field ed-section" key={sec.id}>
          <div className="ed-sec-head">
            <span className="ed-num" style={{ background: sec.color }}>{i + 1}</span>
            <input className="ed-sec-label" value={sec.label}
              onChange={(e) => renameSection(i, e.target.value)} placeholder="項目名" />
            <div className="ed-sec-tools">
              <button type="button" disabled={i === 0} onClick={() => moveSection(i, -1)} aria-label="上へ移動">▲</button>
              <button type="button" disabled={i === sections.length - 1} onClick={() => moveSection(i, 1)} aria-label="下へ移動">▼</button>
              <button type="button" disabled={sections.length <= 1} onClick={() => removeSection(i)} aria-label="この項目を削除">✕</button>
            </div>
          </div>
          {SECTION_HINTS[sec.id] && <span className="ed-opt ed-sec-hint">{SECTION_HINTS[sec.id]}</span>}
          <textarea rows={sec.id === "flow" ? 5 : 3} value={sec.body}
            onChange={(e) => setSectionBody(i, e.target.value)} placeholder={SECTION_HINTS[sec.id] || "内容を入力"} />
        </div>
      ))}
      <div className="ed-sec-add">
        <div className="ed-sec-suggest">
          {SECTION_SUGGESTIONS.filter((s) => !sections.some((sec) => sec.label === s)).map((s) => (
            <button type="button" key={s} className="mchip" onClick={() => addSection(s)}>＋ {s}</button>
          ))}
        </div>
        <button type="button" className="btn soft ed-sec-addbtn" onClick={() => addSection("新しい項目")}>＋ 項目を追加</button>
      </div>

      <div className="ed-kami">
        <div className="ed-kami-head">
          <span className="ed-kami-title">紙芝居をAIでつくる</span>
          {game.storyboard && <span className="ed-kami-done">作成ずみ</span>}
        </div>
        <p className="ed-kami-desc">台本（とくに手番の流れ）をもとに、紙芝居のコマ割りを自動でつくります。できあがりは「紙芝居」タブで確認できます。</p>
        <button className="btn gen" onClick={generateKami} disabled={genLoading}>
          {genLoading ? "紙芝居を作成中…" : game.storyboard ? "紙芝居をつくり直す" : "AIで紙芝居をつくる"}
        </button>
        {genErr && <p className="ed-gen-err">{genErr}</p>}
      </div>

      <div className="ed-actions">
        <button className="btn primary" onClick={() => onRequestPrint("script")}>台本をPDFに書き出す</button>
        <button className="btn soft" onClick={() => onRequestPrint("summary")}>サマリーボードを印刷</button>
        <button className="btn soft" onClick={onDuplicate}>複製</button>
        {isDefault
          ? <button className="btn soft" onClick={onReset}>初期状態に戻す</button>
          : <button className="btn danger" onClick={onDelete}>削除</button>}
      </div>
      <p className="ed-pdf-note">※ 出てくる画面で「PDFとして保存」を選ぶと書き出せます（パソコンのブラウザを推奨）。台本は読み上げ用の全文、サマリーボードは対局中にテーブルへ置く早見用の1枚です。</p>
    </div>
  );
}

/* ---------- 詳細 ---------- */
function Detail({ game, nar, onBack, initialTab, onPatch, onDuplicate, onDelete, onReset, isDefault, role, onRequestPrint }) {
  const pro = role === "pro";
  const [mode, setMode] = useState(pro ? (initialTab || "tutorial") : "kami");
  const switchMode = (m) => { if (m !== mode) { nar.stop(); setMode(m); } };
  const sections = getSections(game);

  return (
    <>
      <button className="back" onClick={onBack}>← 一覧へ</button>
      <div className="board">
        <Cover theme={game.cover} title={game.title || "（無題の台本）"} hero />
        <div className="d-meta">
          <MetaRow game={game} />
          <Tags list={game.mechanics} />
        </div>

        <div className={"tabs" + (pro ? " wide" : "")}>
          <button className={"tab" + (mode === "kami" ? " on" : "")}
            onClick={() => switchMode("kami")}>紙芝居</button>
          <button className={"tab" + (mode === "tutorial" ? " on" : "")}
            onClick={() => switchMode("tutorial")}>すごろく</button>
          <button className={"tab" + (mode === "qa" ? " on" : "")}
            onClick={() => switchMode("qa")}>Q&A</button>
          {pro && (
            <button className={"tab" + (mode === "edit" ? " on" : "")}
              onClick={() => switchMode("edit")}>編集</button>
          )}
        </div>

        {mode === "kami" ? (
          <Kamishibai game={game} nar={nar} />
        ) : mode === "tutorial" ? (
          <>
            {nar.supported ? (
              <div className="controls">
                {!nar.playing ? (
                  <button className="btn primary" onClick={() => nar.playAll(sections, game.audio)}>
                    <Tri /> 全部読む
                  </button>
                ) : nar.paused ? (
                  <button className="btn primary" onClick={nar.resume}><Tri /> 再開</button>
                ) : (
                  <button className="btn soft" onClick={nar.pause}><span className="pause-ic" /> 一時停止</button>
                )}
                <button className="btn soft" onClick={nar.stop} disabled={!nar.playing}>
                  <span className="stop-ic" /> 停止
                </button>
                {nar.active != null && <span className="progress">{nar.active + 1} / {sections.length}</span>}
                <div className="wave" data-on={nar.playing && !nar.paused}>
                  <span /><span /><span /><span /><span />
                </div>
              </div>
            ) : (
              <div className="unsupported">
                音声の読み上げに対応していないブラウザのようです。Chrome か Safari で開くと読み上げられます。
              </div>
            )}

            {nar.supported && (
              <div className="audio-opts">
                <div className="rate">
                  {RATES.map((r) => (
                    <button key={r.label}
                      className={"chip" + (Math.abs(nar.rate - r.v) < 0.01 ? " on" : "")}
                      onClick={() => nar.setRate(r.v)}>{r.label}</button>
                  ))}
                </div>
                {nar.jaVoices.length > 0 && (
                  <label className="voicepick">
                    <span className="voicepick-label">声</span>
                    <select value={nar.voiceURI} onChange={(e) => nar.setVoiceURI(e.target.value)}>
                      {nar.jaVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}

            <Track game={game} sections={sections} nar={nar} />
          </>
        ) : mode === "qa" ? (
          <QAPanel game={game} />
        ) : (
          <Editor game={game} onPatch={onPatch} onDuplicate={onDuplicate}
            onDelete={onDelete} onReset={onReset} isDefault={isDefault}
            onShowKami={() => switchMode("kami")} onRequestPrint={onRequestPrint} />
        )}
      </div>

      <p className="disclaimer">
        ※ ルールはサンプルの要約です。実際に遊ぶときは公式ルールブックでご確認ください。
      </p>
    </>
  );
}

/* ---------- 一覧 ---------- */
const PLAYER_CHIPS = [
  { l: "だれでも", v: null }, { l: "2人", v: 2 }, { l: "3人", v: 3 },
  { l: "4人", v: 4 }, { l: "5人", v: 5 }, { l: "6人〜", v: 6 },
];
const AGE_CHIPS = [
  { l: "指定なし", v: null }, { l: "4歳", v: 4 }, { l: "6歳", v: 6 },
  { l: "8歳", v: 8 }, { l: "10歳〜", v: 10 },
];

function List({ onOpen, onCreate, games, role, onChangeRole, onImport }) {
  const pro = role === "pro";
  const [q, setQ] = useState("");
  const [players, setPlayers] = useState(null);
  const [age, setAge] = useState(null);
  const [tags, setTags] = useState([]);
  const [showMech, setShowMech] = useState(false);

  const toggleTag = (t) => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  const hasFilter = q || players !== null || age !== null || tags.length > 0;
  const clear = () => { setQ(""); setPlayers(null); setAge(null); setTags([]); };

  const results = games.filter((g) => {
    if (q && !(g.title + g.titleKana + g.summary).toLowerCase().includes(q.toLowerCase())) return false;
    if (players !== null) {
      if (players === 6) { if (g.players.max < 6) return false; }
      else if (!(g.players.min <= players && players <= g.players.max)) return false;
    }
    if (age !== null && g.minAge > age) return false;
    if (tags.length && !tags.some((t) => g.mechanics.includes(t))) return false;
    return true;
  });

  return (
    <>
      <div className="role-bar">
        <span className="role-now">{pro ? "インストする人" : "はじめての人"}モード</span>
        <button className="role-change" onClick={onChangeRole}>入り口を変える</button>
      </div>
      <header className="cat-head">
        <div className="eyebrow">AI インスト カタログ</div>
        <h1 className="brand">ヨミテ</h1>
        <p className="tagline">{pro
          ? "台本をつくる、書き換える、PDFで持ち出す。"
          : "遊びたいゲームを見つけて、ルールを声で。"}</p>
      </header>

      {pro && (
        <button className="create-tile" onClick={onCreate}>
          <span className="ct-plus">＋</span>
          <span className="ct-text"><b>台本を新規作成</b><i>自分のインスト台本をつくる</i></span>
        </button>
      )}
      {pro && (
        <button className="import-link" onClick={onImport}>または、スプレッドシート（CSV）でまとめて取り込む</button>
      )}

      <div className="search-wrap">
        <input className="search" type="text" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="タイトルで探す" aria-label="タイトルで探す" />
      </div>

      <div className="filters">
        <div className="filter-group">
          <span className="fg-label">人数</span>
          <div className="chips-row">
            {PLAYER_CHIPS.map((c) => (
              <button key={c.l} className={"fchip" + (players === c.v ? " on" : "")}
                onClick={() => setPlayers(c.v)}>{c.l}</button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="fg-label">遊ぶ子の年齢</span>
          <div className="chips-row">
            {AGE_CHIPS.map((c) => (
              <button key={c.l} className={"fchip" + (age === c.v ? " on" : "")}
                onClick={() => setAge(c.v)}>{c.l}</button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <button className="mech-toggle" onClick={() => setShowMech((s) => !s)}>
            メカニクスで絞る{tags.length ? `（${tags.length}）` : ""}
            <span className={"caret" + (showMech ? " up" : "")}>▾</span>
          </button>
          {showMech && (
            <div className="mech-cloud">
              {MECHANICS.map((m) => (
                <button key={m} className={"mchip" + (tags.includes(m) ? " on" : "")}
                  onClick={() => toggleTag(m)}>{m}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="result-bar">
        <span>{results.length}件</span>
        {hasFilter && <button className="clear" onClick={clear}>条件をクリア</button>}
      </div>

      {results.length === 0 ? (
        <div className="empty">
          条件に合うゲームが見つかりません。<br />フィルターを少しゆるめてみてください。
          <button className="clear big" onClick={clear}>条件をクリア</button>
        </div>
      ) : (
        <div className="grid">
          {results.map((g) => (
            <button key={g.id} className="gcard" onClick={() => onOpen(g.id)}>
              <Cover theme={g.cover} title={g.title || "（無題の台本）"} />
              <div className="gcard-body">
                <p className="gsummary">{g.summary || "（概要は未入力）"}</p>
                <MetaRow game={g} />
                <Tags list={g.mechanics} />
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="disclaimer">
        ※ ルールはサンプルの要約です。カバー画像も仮のものです。
      </p>
    </>
  );
}

/* ---------- 入り口（役割選択） ---------- */
function Landing({ onPick }) {
  return (
    <div className="landing">
      <header className="cat-head landing-head">
        <div className="eyebrow">AI ボードゲーム インスト</div>
        <h1 className="brand">ヨミテ</h1>
        <p className="tagline">あなたに合った入り口を選んでください。</p>
      </header>
      <div className="role-cards">
        <button className="role-card" onClick={() => onPick("beginner")}>
          <div className="rc-art snow"><Pawn color="#fff" /></div>
          <div className="rc-body">
            <h2>はじめての人</h2>
            <p>ルールを<b>声と盤</b>で教わって、インストする人がいなくても、すぐ遊びはじめる。</p>
            <span className="rc-go">遊びかたを教わる →</span>
          </div>
        </button>
        <button className="role-card" onClick={() => onPick("pro")}>
          <div className="rc-art vulture"><Flag /></div>
          <div className="rc-body">
            <h2>インストする人</h2>
            <p>自分の<b>インスト台本</b>をつくって、音声でプレビュー・PDFで持ち出す。</p>
            <span className="rc-go">台本をつくる →</span>
          </div>
        </button>
      </div>
      <p className="disclaimer">モードはあとからいつでも切り替えられます。</p>
    </div>
  );
}

/* ---------- PDF書き出し用の印刷レイアウト ---------- */
function PrintSheet({ game }) {
  if (!game) return null;
  const meta = `${fmtPlayers(game.players)} ・ ${fmtTime(game.time)} ・ ${fmtAge(game.minAge)}`;
  const sections = getSections(game);
  return (
    <div className="print-sheet" aria-hidden="true">
      <div className="ps-head">
        <div className="ps-eyebrow">ボードゲーム インスト台本</div>
        <h1>{game.title || "（無題の台本）"}</h1>
        <div className="ps-meta">{meta}</div>
        {game.mechanics.length > 0 && <div className="ps-tags">{game.mechanics.join("　/　")}</div>}
        {game.summary && <p className="ps-summary">{game.summary}</p>}
      </div>
      <ol className="ps-sections">
        {sections.map((sec, i) => (
          <li key={sec.id}>
            <div className="ps-badge" style={{ background: sec.color }}>{i + 1}</div>
            <div className="ps-body">
              <h2>{sec.label}</h2>
              <p>{sec.body || "（未記入）"}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="ps-foot">ヨミテで作成 ・ ルールは公式ルールブックでご確認ください</div>
    </div>
  );
}

/* ---------- サマリーボード（対局中にテーブルへ置く早見用の1枚） ---------- */
function SummaryBoard({ game }) {
  if (!game) return null;
  const meta = `${fmtPlayers(game.players)} ・ ${fmtTime(game.time)} ・ ${fmtAge(game.minAge)}`;
  const sections = getSections(game);
  return (
    <div className="sum-sheet" aria-hidden="true">
      <div className="sum-head">
        <div className="sum-eyebrow">サマリーボード</div>
        <h1>{game.title || "（無題の台本）"}</h1>
        <div className="sum-meta">{meta}</div>
      </div>
      <div className="sum-grid">
        {sections.map((sec, i) => (
          <div className="sum-card" key={sec.id}>
            <div className="sum-card-head" style={{ borderColor: sec.color }}>
              <span className="sum-dot" style={{ background: sec.color }} />
              <h2>{sec.label}</h2>
            </div>
            <p>{sec.body || "（未記入）"}</p>
          </div>
        ))}
      </div>
      <div className="sum-foot">ヨミテで作成 ・ 対局中の早見用（詳しいルールは公式ルールブックで）</div>
    </div>
  );
}

/* ---------- スプレッドシート（CSV）まとめ取り込み ---------- */
const IMPORT_COLS = [
  "title", "titleKana", "summary", "playersMin", "playersMax",
  "timeMin", "timeMax", "minAge", "mechanics", "cover",
  "world", "goal", "setup", "flow", "pitfalls",
];

function detectDelim(text) {
  const first = (text.split("\n")[0] || "");
  const tabs = (first.match(/\t/g) || []).length;
  const commas = (first.match(/,/g) || []).length;
  return tabs > commas ? "\t" : ",";
}
function parseDSV(text, delim) {
  const rows = [];
  let row = [], field = "", i = 0, inQ = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  while (i < s.length) {
    const c = s[i];
    if (inQ) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === delim) { row.push(field); field = ""; i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
function csvCell(v) {
  const s = String(v == null ? "" : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function buildTemplateText() {
  const rows = [IMPORT_COLS];
  GAMES.forEach((g) => {
    rows.push([
      g.title, g.titleKana, g.summary, g.players.min, g.players.max,
      g.time.min, g.time.max, g.minAge, g.mechanics.join(" / "), g.cover,
      g.inst.world, g.inst.goal, g.inst.setup, g.inst.flow, g.inst.pitfalls,
    ]);
  });
  return rows.map((r) => r.map(csvCell).join(",")).join("\n");
}
function rowsToGames(rows) {
  if (!rows.length) return { games: [], errors: ["データが空です。"] };
  const header = rows[0].map((h) => h.trim());
  const col = (n) => header.indexOf(n);
  const errors = [];
  const out = [];
  if (col("title") < 0) errors.push("ヘッダーに title 列が見つかりません。テンプレートの1行目を残してください。");
  rows.slice(1).forEach((r, ri) => {
    if (!r.some((c) => (c || "").trim() !== "")) return;
    const get = (n) => { const i = col(n); return i >= 0 && r[i] != null ? String(r[i]).trim() : ""; };
    const title = get("title");
    if (!title) { errors.push(`${ri + 2}行目: タイトルが空のためスキップしました。`); return; }
    const intOr = (n, d) => { const v = parseInt(get(n), 10); return Number.isNaN(v) ? d : v; };
    const cov = get("cover");
    const cover = COVER_OPTS.some((c) => c.v === cov) ? cov : "snow";
    const mechanics = get("mechanics").split(/[\/・,|]/).map((x) => x.trim()).filter(Boolean);
    out.push({
      id: "u" + Date.now() + "_" + ri, custom: true,
      title, titleKana: get("titleKana"), summary: get("summary"),
      players: { min: intOr("playersMin", 2), max: intOr("playersMax", 4) },
      time: { min: intOr("timeMin", 15), max: intOr("timeMax", 30) },
      minAge: intOr("minAge", 8),
      mechanics, cover,
      inst: {
        world: get("world"), goal: get("goal"), setup: get("setup"),
        flow: get("flow"), pitfalls: get("pitfalls"),
      },
    });
  });
  return { games: out, errors };
}

function ImportPanel({ onClose, onAdd }) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const fillTemplate = () => { setText(buildTemplateText()); setPreview(null); };
  const downloadTemplate = () => {
    try {
      const blob = new Blob(["\uFEFF" + buildTemplateText()], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "yomite-template.csv";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { fillTemplate(); }
  };
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { setText(String(rd.result || "")); setPreview(null); };
    rd.readAsText(f);
  };
  const doParse = () => {
    if (!text.trim()) { setPreview({ games: [], errors: ["先にCSVを貼り付けるか、ファイルを選んでください。"] }); return; }
    const rows = parseDSV(text, detectDelim(text));
    setPreview(rowsToGames(rows));
  };
  const confirm = () => { if (preview && preview.games.length) onAdd(preview.games); };

  return (
    <>
      <button className="back" onClick={onClose}>← 一覧へ</button>
      <div className="board">
        <div className="eyebrow">まとめて取り込む</div>
        <h2 className="imp-title">スプレッドシートから取り込む</h2>
        <p className="imp-desc">表計算ソフトでゲームを並べて作り、CSV（またはコピーした表）を貼り付けると、まとめて取り込めます。まずテンプレートで列の形を確認してください。</p>

        <div className="imp-tools">
          <button className="btn soft" onClick={fillTemplate}>テンプレートを入力欄に出す</button>
          <button className="btn soft" onClick={downloadTemplate}>CSVをダウンロード</button>
          <button className="btn soft" onClick={() => fileRef.current && fileRef.current.click()}>ファイルを選ぶ</button>
          <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" onChange={onFile} style={{ display: "none" }} />
        </div>

        <textarea className="imp-textarea" value={text} onChange={(e) => { setText(e.target.value); setPreview(null); }}
          placeholder="ここにCSV（またはスプレッドシートからコピーした表）を貼り付け" rows={8} />

        <button className="btn primary imp-read" onClick={doParse}>読み込む</button>

        {preview && (
          <div className="imp-preview">
            {preview.games.length > 0 && (
              <>
                <div className="imp-count">{preview.games.length}件のゲームが見つかりました</div>
                <ul className="imp-titles">
                  {preview.games.map((g) => (
                    <li key={g.id}><b>{g.title}</b><span>{fmtPlayers(g.players)} ・ {fmtAge(g.minAge)}</span></li>
                  ))}
                </ul>
              </>
            )}
            {preview.errors.length > 0 && (
              <ul className="imp-errors">{preview.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            )}
            {preview.games.length > 0 && (
              <button className="btn primary imp-confirm" onClick={confirm}>{preview.games.length}件を取り込む</button>
            )}
          </div>
        )}

        <p className="imp-note">取り込んだゲームは一覧に追加され、保存されます。紙芝居は、各ゲームの「編集」タブから「AIで紙芝居をつくる」で用意できます。</p>
      </div>
    </>
  );
}

const STORE_KEY = "yomite:library:v1";

export default function App() {
  const nar = useNarrator();
  const [games, setGames] = useState(GAMES);
  const [selId, setSelId] = useState(null);
  const [initTab, setInitTab] = useState("tutorial");
  const [role, setRole] = useState(null);
  const [importing, setImporting] = useState(false);
  const [printMode, setPrintMode] = useState("script");
  const [pendingPrint, setPendingPrint] = useState(false);
  const loadedRef = useRef(false);
  const saveTimer = useRef(null);

  const requestPrint = (mode) => { setPrintMode(mode); setPendingPrint(true); };
  useEffect(() => {
    if (!pendingPrint) return;
    setPendingPrint(false);
    const id = requestAnimationFrame(() => window.print());
    return () => cancelAnimationFrame(id);
  }, [pendingPrint]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await storage.get(STORE_KEY);
        if (alive && r && r.value) {
          const parsed = JSON.parse(r.value);
          if (Array.isArray(parsed) && parsed.length) {
            const ids = new Set(parsed.map((g) => g.id));
            const missing = GAMES.filter((g) => !ids.has(g.id));
            setGames(missing.length ? [...parsed, ...missing] : parsed);
          }
        }
      } catch (e) { /* まだ保存された台本ライブラリがない */ }
      loadedRef.current = true;
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      storage.set(STORE_KEY, JSON.stringify(games)).catch(() => {});
    }, 800);
  }, [games]);

  const game = games.find((g) => g.id === selId);
  const isDefault = !!game && GAMES.some((d) => d.id === game.id);

  const open = (id, tab = "tutorial") => { nar.stop(); setInitTab(tab); setSelId(id); window.scrollTo(0, 0); };
  const back = () => { nar.stop(); setSelId(null); window.scrollTo(0, 0); };

  const patch = (p) => setGames((gs) => gs.map((g) => (g.id === selId ? { ...g, ...p } : g)));
  const createNew = () => {
    const id = "u" + Date.now();
    const g = {
      id, title: "", titleKana: "", summary: "",
      players: { min: 2, max: 4 }, time: { min: 15, max: 30 }, minAge: 8,
      mechanics: [], cover: "snow",
      inst: { world: "", goal: "", setup: "", flow: "", pitfalls: "" }, custom: true,
    };
    setGames((gs) => [g, ...gs]);
    open(id, "edit");
  };
  const duplicate = () => {
    if (!game) return;
    const copy = JSON.parse(JSON.stringify(game));
    copy.id = "u" + Date.now();
    copy.title = (game.title || "無題") + " のコピー";
    copy.custom = true;
    setGames((gs) => [copy, ...gs]);
    open(copy.id, "edit");
  };
  const remove = () => {
    if (!game) return;
    const id = game.id;
    setGames((gs) => gs.filter((g) => g.id !== id));
    back();
  };
  const reset = () => {
    if (!game) return;
    const def = GAMES.find((d) => d.id === game.id);
    if (def) setGames((gs) => gs.map((g) => (g.id === def.id ? JSON.parse(JSON.stringify(def)) : g)));
  };
  const changeRole = () => { nar.stop(); setSelId(null); setImporting(false); setRole(null); window.scrollTo(0, 0); };
  const addMany = (arr) => { setGames((gs) => [...arr, ...gs]); setImporting(false); window.scrollTo(0, 0); };

  return (
    <div className="yomite-root">
      <style>{CSS}</style>
      {printMode === "summary" ? <SummaryBoard game={game} /> : <PrintSheet game={game} />}
      <div className="wrap">
        {!role ? (
          <Landing onPick={setRole} />
        ) : importing ? (
          <ImportPanel onClose={() => setImporting(false)} onAdd={addMany} />
        ) : game ? (
          <Detail key={game.id} game={game} nar={nar} onBack={back} initialTab={initTab}
            onPatch={patch} onDuplicate={duplicate} onDelete={remove} onReset={reset}
            isDefault={isDefault} role={role} onRequestPrint={requestPrint} />
        ) : (
          <List games={games} onOpen={open} onCreate={createNew} role={role}
            onChangeRole={changeRole} onImport={() => { setImporting(true); window.scrollTo(0, 0); }} />
        )}
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Zen+Maru+Gothic:wght@500;700&display=swap');

.yomite-root{
  --table:#241B13; --paper:#F3E9D2; --card:#FCF5E3; --ink:#352A1C; --muted:#9C8C6F;
  --vermilion:#D8553F; --gold:#C8902F; --board-edge:#D9C9A3;
  font-family:'Zen Kaku Gothic New',system-ui,sans-serif; color:#F2E8D1; min-height:100vh;
  background:
    radial-gradient(120% 60% at 50% -8%, rgba(255,232,190,.10), transparent 55%),
    repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0 1px, transparent 1px 86px),
    var(--table);
  -webkit-font-smoothing:antialiased;
}
.yomite-root *{box-sizing:border-box;}
.wrap{max-width:600px;margin:0 auto;padding:20px 16px 60px;}

/* ---- カタログ見出し ---- */
.cat-head{margin-bottom:16px;}
.eyebrow{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;
  letter-spacing:.2em;font-size:11px;text-transform:uppercase;color:var(--gold);}
.brand{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;
  font-size:42px;line-height:.95;margin:5px 0 3px;letter-spacing:.05em;color:#F6EFDD;}
.tagline{margin:0;font-size:13.5px;color:rgba(242,232,209,.66);}

/* ---- 検索 ---- */
.search-wrap{margin-bottom:14px;}
.search{width:100%;font-family:inherit;font-size:15px;color:var(--ink);
  background:var(--card);border:1.5px solid #cdbf9e;border-radius:13px;padding:13px 15px;}
.search::placeholder{color:#b3a585;}

/* ---- フィルター ---- */
.filters{display:flex;flex-direction:column;gap:13px;margin-bottom:6px;}
.fg-label{display:block;font-size:11.5px;font-weight:700;color:rgba(242,232,209,.6);
  margin-bottom:7px;letter-spacing:.06em;}
.chips-row{display:flex;flex-wrap:wrap;gap:6px;}
.fchip{font-size:13px;font-weight:500;padding:7px 13px;border-radius:999px;cursor:pointer;
  background:rgba(255,255,255,.05);color:#e7dabc;border:1.5px solid rgba(242,232,209,.22);
  transition:all .12s ease;}
.fchip.on{background:var(--paper);color:var(--table);border-color:var(--paper);font-weight:700;}
.mech-toggle{display:inline-flex;align-items:center;gap:7px;font-family:inherit;
  font-size:13.5px;font-weight:700;color:var(--gold);background:transparent;border:none;cursor:pointer;padding:2px 0;}
.caret{transition:transform .15s ease;display:inline-block;}
.caret.up{transform:rotate(180deg);}
.mech-cloud{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding:12px;
  background:var(--card);border:1.5px solid #cdbf9e;border-radius:14px;}
.mchip{font-size:12.5px;font-weight:500;padding:6px 11px;border-radius:9px;cursor:pointer;
  background:#EFE4CA;color:#5d513b;border:1.5px solid transparent;transition:all .12s ease;}
.mchip.on{background:var(--vermilion);color:#fff;font-weight:700;}

.result-bar{display:flex;align-items:center;justify-content:space-between;
  margin:16px 2px 12px;font-size:13px;font-weight:700;color:rgba(242,232,209,.66);}
.clear{font-family:inherit;font-size:13px;font-weight:700;color:#E9A23B;background:transparent;border:none;cursor:pointer;}
.clear.big{display:block;margin:16px auto 0;border:1.5px solid #E9A23B;padding:9px 18px;border-radius:11px;}

/* ---- カバー ---- */
.cover{position:relative;border-radius:13px;overflow:hidden;display:flex;align-items:flex-end;
  padding:14px;color:#fff;min-height:120px;}
.cover.hero{min-height:150px;border-radius:16px;padding:18px;}
.cv-title{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:21px;line-height:1.25;
  position:relative;z-index:2;text-shadow:0 2px 12px rgba(0,0,0,.42);}
.cover.hero .cv-title{font-size:27px;}
.cover::before{content:"";position:absolute;inset:0;z-index:1;}
.cover.snow{background:linear-gradient(150deg,#2E6E78,#62A2AC);}
.cover.snow::before{background-image:
  radial-gradient(circle at 18% 28%, rgba(255,255,255,.55) 2px, transparent 3px),
  radial-gradient(circle at 68% 18%, rgba(255,255,255,.4) 1.5px, transparent 3px),
  radial-gradient(circle at 42% 62%, rgba(255,255,255,.45) 2px, transparent 3px),
  radial-gradient(circle at 84% 52%, rgba(255,255,255,.4) 1.5px, transparent 3px),
  radial-gradient(circle at 30% 84%, rgba(255,255,255,.35) 1.5px, transparent 3px);}
.cover.vermin{background:linear-gradient(150deg,#3A2E3F,#6E4B58);}
.cover.vermin::before{background-image:
  radial-gradient(circle at 28% 36%, rgba(0,0,0,.32) 3px, transparent 4px),
  radial-gradient(circle at 72% 60%, rgba(0,0,0,.26) 2.5px, transparent 4px),
  radial-gradient(circle at 52% 80%, rgba(0,0,0,.22) 2px, transparent 4px);}
.cover.vulture{background:linear-gradient(150deg,#B85F2A,#E6A93C);}
.cover.vulture::before{background:
  radial-gradient(130% 90% at 82% 4%, rgba(255,255,255,.28), transparent 55%),
  radial-gradient(80% 60% at 12% 100%, rgba(0,0,0,.18), transparent 60%);}

/* ---- メタ・タグ ---- */
.meta-row{display:flex;align-items:center;gap:8px;font-size:13px;color:#6a5f48;flex-wrap:wrap;}
.meta-row b{font-weight:700;color:var(--ink);}
.meta-row .dot{width:3px;height:3px;border-radius:50%;background:#c3b594;}
.meta-row.dark{color:rgba(242,232,209,.8);}
.meta-row.dark b{color:#fff;}
.tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px;}
.tag{font-size:11.5px;font-weight:500;color:#6a5f48;background:#EBE0C6;padding:3px 9px;border-radius:7px;}

/* ---- グリッド（盤上のタイル） ---- */
.grid{display:grid;grid-template-columns:1fr;gap:14px;}
@media (min-width:480px){.grid{grid-template-columns:1fr 1fr;}}
.gcard{text-align:left;font-family:inherit;cursor:pointer;background:var(--card);
  border:1px solid #cdbf9e;border-bottom-width:5px;border-radius:16px;padding:9px;overflow:hidden;
  display:flex;flex-direction:column;
  box-shadow:0 10px 24px -16px rgba(0,0,0,.7);transition:transform .15s ease,box-shadow .15s ease;}
.gcard:hover{transform:translateY(-4px);box-shadow:0 20px 34px -18px rgba(0,0,0,.75);}
.gcard-body{padding:12px 6px 4px;}
.gsummary{margin:0 0 10px;font-size:13px;line-height:1.65;color:#473d2b;}

.empty{text-align:center;color:rgba(242,232,209,.7);font-size:14px;line-height:1.9;
  padding:40px 20px;background:rgba(255,255,255,.04);border:1.5px dashed rgba(242,232,209,.28);border-radius:18px;}

/* ---- 戻る ---- */
.back{font-family:inherit;font-size:14px;font-weight:700;color:#EAD9B4;background:transparent;
  border:none;cursor:pointer;padding:4px 0;margin-bottom:12px;}

/* ---- 盤（詳細パネル） ---- */
.board{background:
  repeating-linear-gradient(135deg, rgba(0,0,0,.012) 0 12px, transparent 12px 24px),
  var(--paper);
  border-radius:20px;padding:16px 16px 22px;color:var(--ink);
  border:1px solid var(--board-edge);
  box-shadow:0 26px 60px -30px rgba(0,0,0,.9), inset 0 0 0 6px rgba(255,255,255,.35), inset 0 0 0 7px var(--board-edge);}
.d-meta{margin:14px 4px 4px;}

/* ---- タブ ---- */
.tabs{display:flex;gap:6px;margin:16px 0 4px;background:#E9DDC1;padding:5px;border-radius:13px;}
.tab{flex:1;min-width:0;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:14px;
  padding:9px 10px;border-radius:9px;cursor:pointer;border:none;background:transparent;color:#7c6f55;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:all .14s ease;}
.tab.on{background:var(--card);color:var(--ink);box-shadow:0 3px 8px -4px rgba(0,0,0,.4);}
.tabs.wide{gap:4px;padding:4px;}
.tabs.wide .tab{font-size:12.5px;padding:9px 4px;}

.controls{display:flex;align-items:center;gap:10px;margin-top:16px;flex-wrap:wrap;}
.btn{display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer;
  font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:15px;
  padding:11px 18px;border-radius:13px;transition:transform .12s ease,filter .12s ease;}
.btn:active{transform:translateY(1px);}
.btn.primary{background:var(--vermilion);color:#fff;box-shadow:0 8px 18px -9px var(--vermilion);}
.btn.primary:hover{filter:brightness(1.06);}
.btn.soft{background:#E8DCC0;color:#4a3f2c;}
.btn.soft:hover{background:#dfd1b0;}
.btn:disabled{opacity:.45;cursor:not-allowed;}
.pause-ic{width:10px;height:11px;border-left:3px solid currentColor;border-right:3px solid currentColor;}
.stop-ic{width:11px;height:11px;background:currentColor;border-radius:2px;}
.progress{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:14px;color:#8a7c5f;}
.wave{display:flex;align-items:flex-end;gap:3px;height:22px;margin-left:auto;opacity:.3;}
.wave span{width:3px;height:6px;background:var(--gold);border-radius:2px;}
.wave[data-on="true"]{opacity:1;}
.wave[data-on="true"] span{animation:bar .9s ease-in-out infinite;}
.wave[data-on="true"] span:nth-child(2){animation-delay:.15s;}
.wave[data-on="true"] span:nth-child(3){animation-delay:.3s;}
.wave[data-on="true"] span:nth-child(4){animation-delay:.45s;}
.wave[data-on="true"] span:nth-child(5){animation-delay:.6s;}
@keyframes bar{0%,100%{height:5px;}50%{height:20px;}}

.unsupported{margin-top:14px;font-size:13px;line-height:1.6;color:#8a3a28;
  background:rgba(216,85,63,.12);padding:12px 14px;border-radius:12px;}

.audio-opts{margin-top:14px;}
.rate{display:flex;gap:7px;}
.chip{font-size:12.5px;font-weight:500;padding:6px 13px;border-radius:999px;cursor:pointer;
  background:transparent;color:#7c6f55;border:1.5px solid #cdbf9e;transition:all .12s ease;}
.chip.on{background:var(--ink);color:var(--paper);border-color:var(--ink);font-weight:700;}
.voicepick{display:flex;align-items:center;gap:9px;margin-top:11px;}
.voicepick-label{font-size:12px;color:#8a7c5f;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;}
.voicepick select{flex:1;min-width:0;font-family:'Zen Kaku Gothic New',sans-serif;font-size:13px;
  color:var(--ink);background:#fff;border:1.5px solid #cdbf9e;border-radius:10px;padding:8px 11px;
  cursor:pointer;-webkit-appearance:none;appearance:none;}

/* ---- すごろくトラック ---- */
.track{position:relative;margin-top:22px;display:flex;flex-direction:column;gap:18px;}
.rail-line{position:absolute;left:24px;width:7px;transform:translateX(-50%);z-index:1;border-radius:7px;
  background:repeating-linear-gradient(180deg, #d3c4a0 0 8px, transparent 8px 16px);}
.piece{position:absolute;left:24px;width:32px;height:40px;z-index:3;transform:translate(-50%,-50%);
  transition:top .55s cubic-bezier(.34,1.5,.6,1), opacity .3s ease;
  filter:drop-shadow(0 6px 5px rgba(0,0,0,.32));}
.piece .pawn-svg{width:100%;height:100%;display:block;}
.station{display:grid;grid-template-columns:48px 1fr;gap:13px;align-items:start;}
.node{position:relative;z-index:2;width:40px;height:40px;border-radius:50%;border:2.5px solid;
  display:flex;align-items:center;justify-content:center;margin:0 auto;
  font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:17px;
  box-shadow:0 3px 8px -3px rgba(0,0,0,.4);transition:background .3s ease,color .3s ease;}
.station-card{background:var(--card);border:1.5px solid #e5d9bd;border-radius:16px;
  padding:14px 15px;transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease;}
.station.on .station-card{transform:translateY(-2px);background:#fff;}
.sc-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;}
.sc-head h3{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:16.5px;margin:0;transition:color .2s ease;}
.read{display:inline-flex;align-items:center;gap:5px;flex:0 0 auto;font-family:'Zen Maru Gothic',sans-serif;
  font-weight:700;font-size:12.5px;background:transparent;border:1.5px solid;border-radius:999px;padding:5px 12px;cursor:pointer;}
.read:hover{background:rgba(0,0,0,.035);}
.station-card p{margin:0;font-size:14px;line-height:1.78;color:#4a3f2c;}
.sc-text span{display:block;}
.sc-text span + span{margin-top:5px;}

/* ---- ルールQ&A ---- */
.qa{margin-top:18px;}
.qa-intro{margin:0 2px 12px;font-size:13.5px;line-height:1.7;color:#5d513b;}
.qa-intro b{color:var(--ink);}
.qa-log{background:#EEE3C9;border:1.5px solid #ddceae;border-radius:16px;
  padding:14px;min-height:150px;max-height:340px;overflow-y:auto;
  display:flex;flex-direction:column;gap:12px;}
.qa-empty{margin:auto;display:flex;flex-direction:column;align-items:center;gap:10px;
  color:#9c8c6f;font-size:13.5px;text-align:center;}
.qa-empty .pawn-svg{width:30px;height:38px;filter:drop-shadow(0 4px 4px rgba(0,0,0,.2));}
.bubble-row{display:flex;gap:8px;align-items:flex-end;max-width:90%;}
.bubble-row.user{margin-left:auto;flex-direction:row-reverse;}
.avatar{flex:0 0 auto;width:30px;height:30px;border-radius:50%;display:flex;
  align-items:center;justify-content:center;box-shadow:0 2px 6px -2px rgba(0,0,0,.4);}
.avatar .pawn-svg{width:17px;height:21px;}
.bubble{font-size:14px;line-height:1.7;padding:10px 13px;border-radius:14px;white-space:pre-wrap;}
.bubble.assistant{background:#fff;color:var(--ink);border-bottom-left-radius:5px;
  box-shadow:0 4px 12px -8px rgba(0,0,0,.4);}
.bubble.user{color:#fff;border-bottom-right-radius:5px;}
.dots{display:inline-flex;gap:4px;padding:2px 0;}
.dots i{width:7px;height:7px;border-radius:50%;background:#c3b594;animation:blink 1.2s infinite;}
.dots i:nth-child(2){animation-delay:.2s;}
.dots i:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,60%,100%{opacity:.3;}30%{opacity:1;}}
.qa-err{margin-top:10px;font-size:13px;color:#8a3a28;background:rgba(216,85,63,.12);
  padding:10px 13px;border-radius:11px;}
.qa-sugs{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px;}
.sug{font-family:inherit;font-size:13px;font-weight:500;padding:8px 13px;border-radius:999px;cursor:pointer;
  background:var(--card);color:#5d513b;border:1.5px solid #d3c4a0;transition:all .12s ease;}
.sug:hover{background:#fff;}
.sug:disabled{opacity:.5;cursor:not-allowed;}
.qa-input{display:flex;gap:9px;margin-top:13px;}
.qa-input input{flex:1;min-width:0;font-family:inherit;font-size:15px;color:var(--ink);
  background:#fff;border:1.5px solid #d3c4a0;border-radius:13px;padding:12px 14px;}
.qa-input input::placeholder{color:#b3a585;}
.qa-send{flex:0 0 auto;width:48px;border:none;border-radius:13px;color:#fff;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:filter .12s ease,opacity .12s ease;}
.qa-send:hover{filter:brightness(1.08);}
.qa-send:disabled{opacity:.4;cursor:not-allowed;}
.qa-note{margin:11px 2px 0;font-size:11.5px;color:#9c8c6f;line-height:1.6;}

/* ---- 入り口（役割選択） ---- */
.landing{padding-top:8px;}
.landing-head{text-align:center;margin-bottom:22px;}
.landing-head .brand{font-size:54px;}
.role-cards{display:flex;flex-direction:column;gap:14px;}
.role-card{display:flex;align-items:stretch;gap:0;text-align:left;cursor:pointer;font-family:inherit;
  background:var(--card);border:1px solid #cdbf9e;border-bottom-width:5px;border-radius:18px;overflow:hidden;
  box-shadow:0 12px 28px -18px rgba(0,0,0,.8);transition:transform .15s ease,box-shadow .15s ease;}
.role-card:hover{transform:translateY(-4px);box-shadow:0 22px 38px -20px rgba(0,0,0,.85);}
.rc-art{flex:0 0 96px;display:flex;align-items:center;justify-content:center;color:#fff;position:relative;}
.rc-art .pawn-svg{width:40px;height:50px;filter:drop-shadow(0 5px 6px rgba(0,0,0,.35));}
.rc-art svg{width:34px;height:34px;}
.rc-art.snow{background:linear-gradient(150deg,#2E6E78,#62A2AC);}
.rc-art.vulture{background:linear-gradient(150deg,#B85F2A,#E6A93C);}
.rc-body{padding:16px 16px 16px 18px;}
.rc-body h2{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:19px;margin:0 0 6px;color:var(--ink);}
.rc-body p{margin:0 0 10px;font-size:13px;line-height:1.7;color:#4a3f2c;}
.rc-body p b{color:var(--ink);}
.rc-go{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:13px;color:var(--vermilion);}

/* ---- 役割バー ---- */
.role-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;}
.role-now{font-size:12px;font-weight:700;color:var(--gold);
  background:rgba(200,144,47,.12);border:1px solid rgba(200,144,47,.3);padding:5px 11px;border-radius:999px;}
.role-change{font-family:inherit;font-size:12.5px;font-weight:700;color:rgba(242,232,209,.7);
  background:transparent;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:3px;}

/* ---- 新規作成タイル ---- */
.create-tile{display:flex;align-items:center;gap:13px;width:100%;cursor:pointer;font-family:inherit;
  background:rgba(255,255,255,.05);border:1.5px dashed rgba(242,232,209,.32);border-radius:14px;
  padding:14px 16px;margin-bottom:14px;color:#F2E8D1;transition:all .14s ease;text-align:left;}
.create-tile:hover{background:rgba(255,255,255,.09);border-color:rgba(242,232,209,.5);}
.ct-plus{flex:0 0 auto;width:34px;height:34px;border-radius:50%;background:var(--vermilion);color:#fff;
  display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;}
.ct-text{display:flex;flex-direction:column;line-height:1.4;}
.ct-text b{font-family:'Zen Maru Gothic',sans-serif;font-size:15px;}
.ct-text i{font-style:normal;font-size:12px;color:rgba(242,232,209,.6);}

.import-link{display:block;width:100%;margin:-4px 0 14px;font-family:inherit;font-size:12.5px;
  font-weight:700;color:rgba(242,232,209,.72);background:transparent;border:none;cursor:pointer;
  text-align:center;text-decoration:underline;text-underline-offset:3px;}
.import-link:hover{color:#F2E8D1;}

/* ---- まとめ取り込み画面 ---- */
.imp-title{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:21px;margin:5px 0 8px;color:var(--ink);}
.imp-desc{margin:0 0 14px;font-size:13px;line-height:1.75;color:#5d513b;}
.imp-tools{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
.imp-tools .btn{font-size:13px;padding:9px 13px;}
.imp-textarea{width:100%;font-family:'Zen Kaku Gothic New',sans-serif;font-size:13px;line-height:1.6;
  color:var(--ink);background:#fff;border:1.5px solid #d3c4a0;border-radius:12px;padding:12px;resize:vertical;}
.imp-textarea::placeholder{color:#b3a585;}
.imp-read{width:100%;margin-top:12px;justify-content:center;}
.imp-preview{margin-top:16px;background:#EEE3C9;border:1.5px solid #ddceae;border-radius:14px;padding:14px;}
.imp-count{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:14px;color:var(--ink);margin-bottom:10px;}
.imp-titles{list-style:none;margin:0 0 4px;padding:0;display:flex;flex-direction:column;gap:7px;}
.imp-titles li{display:flex;align-items:baseline;justify-content:space-between;gap:10px;
  font-size:13.5px;color:#4a3f2c;border-bottom:1px dashed #d8c8a4;padding-bottom:6px;}
.imp-titles li b{font-weight:700;}
.imp-titles li span{flex:0 0 auto;font-size:11.5px;color:#8a7c5f;}
.imp-errors{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:5px;}
.imp-errors li{font-size:12px;color:#8a3a28;background:rgba(216,85,63,.1);padding:6px 10px;border-radius:8px;}
.imp-confirm{width:100%;margin-top:14px;justify-content:center;}
.imp-note{margin:14px 2px 0;font-size:11.5px;color:#9c8c6f;line-height:1.7;}

/* ---- エディタ ---- */
.editor{margin-top:18px;}
.ed-hint{margin:0 2px 16px;font-size:13px;line-height:1.7;color:#5d513b;
  background:#EEE3C9;border:1px solid #ddceae;border-radius:11px;padding:11px 13px;}
.ed-field{margin-bottom:15px;}
.ed-field > label{display:flex;align-items:center;flex-wrap:wrap;gap:8px;
  font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:14px;color:var(--ink);margin-bottom:7px;}
.ed-opt{font-family:'Zen Kaku Gothic New',sans-serif;font-weight:400;font-size:11.5px;color:#9c8c6f;}
.ed-num{flex:0 0 auto;width:21px;height:21px;border-radius:50%;color:#fff;display:inline-flex;
  align-items:center;justify-content:center;font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:12px;}
.ed-field input, .ed-field textarea{width:100%;font-family:'Zen Kaku Gothic New',sans-serif;font-size:14.5px;
  color:var(--ink);background:#fff;border:1.5px solid #d3c4a0;border-radius:11px;padding:11px 13px;line-height:1.7;}
.ed-field textarea{resize:vertical;min-height:54px;}
.ed-field input:focus, .ed-field textarea:focus{outline:none;border-color:var(--gold);}
.ed-narrow{max-width:120px;}
.ed-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.ed-pair{display:flex;align-items:center;gap:8px;}
.ed-pair input{width:100%;text-align:center;}
.ed-pair span{color:#9c8c6f;}
.ed-covers{display:flex;gap:8px;}
.ed-cover{flex:1;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:13px;color:#fff;
  border:none;border-radius:11px;padding:14px 8px;cursor:pointer;opacity:.5;
  transition:opacity .14s ease,transform .12s ease;text-shadow:0 1px 4px rgba(0,0,0,.3);}
.ed-cover.on{opacity:1;transform:translateY(-2px);box-shadow:0 8px 16px -10px rgba(0,0,0,.6);}
.ed-cover.snow{background:linear-gradient(150deg,#2E6E78,#62A2AC);}
.ed-cover.vermin{background:linear-gradient(150deg,#3A2E3F,#6E4B58);}
.ed-cover.vulture{background:linear-gradient(150deg,#B85F2A,#E6A93C);}
.ed-mechs{display:flex;flex-wrap:wrap;gap:6px;}
.ed-sep{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:13px;color:#8a7c5f;
  letter-spacing:.04em;margin:22px 0 14px;padding-top:14px;border-top:1.5px dashed #d3c4a0;}
.ed-sep-note{display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-weight:400;
  letter-spacing:0;font-size:11.5px;color:#9c8c6f;margin-top:4px;}
.ed-sec-head{display:flex;align-items:center;gap:8px;margin-bottom:2px;}
.ed-sec-label{flex:1;min-width:0;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:14px;
  color:var(--ink);background:transparent;border:none;border-bottom:1.5px dashed #cdbf9e;padding:2px 2px 4px;}
.ed-sec-label:focus{outline:none;border-bottom-color:var(--gold);}
.ed-sec-hint{display:block;margin-bottom:7px;}
.ed-sec-tools{display:flex;gap:4px;flex:0 0 auto;}
.ed-sec-tools button{width:26px;height:26px;border-radius:8px;border:1.5px solid #d3c4a0;background:#fff;
  color:#7c6f55;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.ed-sec-tools button:disabled{opacity:.35;cursor:not-allowed;}
.ed-sec-tools button:hover:not(:disabled){background:var(--card);}
.ed-sec-add{margin-top:4px;}
.ed-sec-suggest{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;}
.ed-sec-addbtn{width:100%;justify-content:center;}
.ed-kami{margin:22px 0 0;padding-top:18px;border-top:1.5px dashed #d3c4a0;}
.ed-kami-head{display:flex;align-items:center;gap:10px;margin-bottom:7px;}
.ed-kami-title{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:14px;color:var(--ink);}
.ed-kami-done{font-size:11px;font-weight:700;color:#4d7d5e;background:rgba(92,154,107,.16);
  padding:3px 9px;border-radius:999px;}
.ed-kami-desc{margin:0 0 11px;font-size:12.5px;line-height:1.7;color:#6a5f48;}
.btn.gen{width:100%;background:#235049;color:#fff;justify-content:center;
  box-shadow:0 8px 18px -10px #235049;}
.btn.gen:hover:not(:disabled){filter:brightness(1.1);}
.ed-gen-err{margin:10px 0 0;font-size:12.5px;color:#8a3a28;background:rgba(216,85,63,.12);
  padding:9px 12px;border-radius:10px;}
.ed-actions{display:flex;gap:9px;margin-top:22px;padding-top:16px;border-top:1.5px dashed #d3c4a0;flex-wrap:wrap;}
.btn.danger{background:#fff;color:var(--vermilion);border:1.5px solid var(--vermilion);}
.btn.danger:hover{background:rgba(216,85,63,.08);}
.ed-pdf-note{margin:11px 2px 0;font-size:11.5px;color:#9c8c6f;line-height:1.6;}

/* ---- 紙芝居 ---- */
.kami{margin-top:18px;}
.kami-chaps-wrap{position:relative;margin-bottom:13px;}
.kami-chaps{display:flex;gap:7px;overflow-x:auto;padding-bottom:2px;}
.kami-chaps-fade{position:absolute;top:0;right:0;bottom:2px;width:32px;pointer-events:none;
  background:linear-gradient(to right, rgba(243,233,210,0), var(--paper));}
.kchap{flex:0 0 auto;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:12.5px;
  padding:7px 13px;border-radius:999px;cursor:pointer;background:var(--card);
  color:#7c6f55;border:1.5px solid #d3c4a0;transition:all .12s ease;}
.kchap.on{background:#fff;box-shadow:0 4px 10px -6px rgba(0,0,0,.4);}
.kami-stage{position:relative;background:#EADBBE;border:1.5px solid #d8c8a4;border-radius:18px;padding:10px;
  box-shadow:inset 0 2px 10px -4px rgba(0,0,0,.3);}
.kami-svg{width:100%;height:auto;display:block;}
.kami-img{width:100%;display:block;aspect-ratio:320/200;object-fit:cover;border-radius:12px;
  animation:kpop .42s cubic-bezier(.34,1.4,.6,1);}
.kami-speaking{position:absolute;top:14px;right:14px;display:flex;align-items:center;gap:6px;
  font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:11px;
  background:rgba(255,255,255,.85);padding:5px 10px;border-radius:999px;}
.kspk{display:inline-flex;gap:3px;align-items:flex-end;height:11px;}
.kspk i{width:3px;height:5px;background:currentColor;border-radius:2px;animation:bar .9s ease-in-out infinite;}
.kspk i:nth-child(2){animation-delay:.15s;}
.kspk i:nth-child(3){animation-delay:.3s;}
.kami-pop{animation:kpop .42s cubic-bezier(.34,1.4,.6,1);transform-origin:center;}
@keyframes kpop{from{opacity:0;transform:translateY(8px) scale(.95);}to{opacity:1;transform:none;}}
.kami-cap{font-family:'Zen Maru Gothic',sans-serif;font-size:15px;line-height:1.75;color:var(--ink);
  margin:15px 4px;min-height:3.4em;}
.kami-dots-row{display:flex;justify-content:center;gap:7px;align-items:center;margin:0 0 14px;}
.kdot{width:8px;height:8px;border-radius:50%;background:#cdbf9e;transition:transform .15s ease;}
.kdot.on{transform:scale(1.5);}
.kami-steps{display:flex;gap:10px;}
.kstep{font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:15px;border:none;border-radius:13px;
  padding:14px 16px;cursor:pointer;transition:filter .12s ease,transform .12s ease;}
.kstep:active{transform:translateY(1px);}
.kstep.back{flex:0 0 auto;background:#E8DCC0;color:#4a3f2c;}
.kstep.next{flex:1;color:#fff;box-shadow:0 8px 18px -10px rgba(0,0,0,.5);}
.kstep.next:hover{filter:brightness(1.05);}
.kstep:disabled{opacity:.5;cursor:not-allowed;box-shadow:none;}
.kami-replay{width:100%;margin-top:10px;display:inline-flex;align-items:center;justify-content:center;gap:7px;
  background:transparent;border:1.5px solid #d3c4a0;color:#5d513b;
  font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:13.5px;border-radius:12px;padding:11px;cursor:pointer;}
.kami-replay:hover{background:var(--card);}
.kami-note{margin:12px 2px 0;font-size:11.5px;color:#9c8c6f;line-height:1.6;text-align:center;}
.kami-empty{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;
  color:#8a7c5f;font-size:13.5px;line-height:1.8;padding:40px 20px;
  background:#EEE3C9;border:1.5px dashed #d3c4a0;border-radius:16px;}
.kami-empty .pawn-svg{width:32px;height:40px;}

/* ---- 印刷(PDF書き出し)用 ---- */
.print-sheet{display:none;}
.sum-sheet{display:none;}
@media print{
  @page{margin:14mm;}
  .yomite-root{background:#fff !important;}
  .wrap{display:none !important;}
  .print-sheet{display:block !important;color:#1c1c1c;
    font-family:'Zen Kaku Gothic New',sans-serif;}
  .ps-eyebrow{font-family:'Bricolage Grotesque',sans-serif;font-size:10px;
    letter-spacing:.22em;text-transform:uppercase;color:#999;}
  .ps-head{border-bottom:2.5px solid #1c1c1c;padding-bottom:11px;margin-bottom:18px;}
  .ps-head h1{font-family:'Zen Maru Gothic',sans-serif;font-size:27px;margin:5px 0 7px;color:#111;}
  .ps-meta{font-size:12.5px;color:#333;font-weight:700;}
  .ps-tags{font-size:11px;color:#666;margin-top:4px;}
  .ps-summary{font-size:12.5px;line-height:1.7;margin:9px 0 0;color:#333;}
  .ps-sections{list-style:none;padding:0;margin:0;}
  .ps-sections li{display:flex;gap:13px;margin-bottom:15px;page-break-inside:avoid;break-inside:avoid;}
  .ps-badge{flex:0 0 auto;width:27px;height:27px;border-radius:50%;color:#fff;display:flex;
    align-items:center;justify-content:center;font-family:'Bricolage Grotesque',sans-serif;
    font-weight:700;font-size:15px;margin-top:1px;
    -webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .ps-body h2{font-family:'Zen Maru Gothic',sans-serif;font-size:15.5px;margin:2px 0 4px;color:#111;}
  .ps-body p{font-size:12.5px;line-height:1.78;margin:0;color:#2a2a2a;white-space:pre-wrap;}
  .ps-foot{margin-top:20px;padding-top:9px;border-top:1px solid #ccc;font-size:10px;color:#999;text-align:center;}

  .sum-sheet{display:block !important;color:#1c1c1c;font-family:'Zen Kaku Gothic New',sans-serif;}
  .sum-eyebrow{font-family:'Bricolage Grotesque',sans-serif;font-size:9px;
    letter-spacing:.2em;text-transform:uppercase;color:#999;}
  .sum-head{border-bottom:2px solid #1c1c1c;padding-bottom:8px;margin-bottom:12px;}
  .sum-head h1{font-family:'Zen Maru Gothic',sans-serif;font-size:20px;margin:4px 0 5px;color:#111;}
  .sum-meta{font-size:11px;color:#333;font-weight:700;}
  .sum-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;}
  .sum-card{page-break-inside:avoid;break-inside:avoid;}
  .sum-card-head{display:flex;align-items:center;gap:6px;border-bottom:1.5px solid;padding-bottom:3px;margin-bottom:4px;}
  .sum-dot{width:8px;height:8px;border-radius:50%;flex:0 0 auto;
    -webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .sum-card-head h2{font-family:'Zen Maru Gothic',sans-serif;font-size:12.5px;margin:0;color:#111;}
  .sum-card p{font-size:10px;line-height:1.55;margin:0;color:#2a2a2a;white-space:pre-wrap;}
  .sum-foot{margin-top:14px;padding-top:7px;border-top:1px solid #ccc;font-size:9px;color:#999;
    text-align:center;grid-column:1 / -1;}
}

.disclaimer{margin:22px 4px 0;font-size:12px;color:rgba(242,232,209,.55);line-height:1.65;text-align:center;}

:focus-visible{outline:3px solid var(--gold);outline-offset:2px;border-radius:6px;}
@media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important;}}
@media (max-width:420px){.brand{font-size:37px;}.btn{padding:10px 15px;font-size:14px;}}
`;
