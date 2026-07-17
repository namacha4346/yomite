// 用語データ。2種類に分ける。
//  ①一般用語（general）：ボードゲーム全般で使う言葉 → 用語辞典（/glossary）に載せる。
//     台本本文では初出だけ自動で辞典へリンクする（link: true のもの）。
//  ②ゲーム専用用語（game 指定）：そのゲームだけの言い回し・名詞（例：威信ポイント）
//     → 各台本の一番後ろ「専門用語」タブに載せる。辞典には出さない／本文リンクもしない。

export const GLOSSARY = [
  // ───────────── ①一般用語（辞典に載る） ─────────────
  // 基本の言葉
  {
    id: "instruction",
    term: "インスト",
    cat: "基本の言葉",
    link: true,
    def: "ゲームのルールを説明すること。英語 instruction（説明）の略。このサイトは、その説明を助ける“台本”を用意しています。",
  },
  {
    id: "teban",
    term: "手番",
    aliases: ["自分の番"],
    cat: "基本の言葉",
    link: false,
    def: "自分がアクションを行う番のこと。多くのゲームは時計回りに手番が回っていきます。",
  },
  {
    id: "round",
    term: "ラウンド",
    cat: "基本の言葉",
    link: false,
    def: "全員が1回ずつ手番を行うなどの、ひとまとまりの周回のこと。何ラウンドかを繰り返してゲームが進みます。",
  },
  {
    id: "summary",
    term: "早見表",
    aliases: ["サマリー"],
    cat: "基本の言葉",
    link: true,
    def: "手番でできることや得点などを、遊ぶときにサッと確認できるようまとめた1枚。台本から自動でつくられます。",
  },

  // メカニクス（仕組み）
  {
    id: "worker-placement",
    term: "ワカプレ",
    aliases: ["ワーカープレイスメント"],
    cat: "メカニクス（仕組み）",
    link: true,
    def: "手番に自分のコマ（労働者＝ワーカー）を場所に置いて、その場所の効果を得る仕組み。良い場所は早い者勝ちで、埋まると置けません。",
  },
  {
    id: "deck-building",
    term: "デッキ構築",
    aliases: ["デッキビルド"],
    cat: "メカニクス（仕組み）",
    link: true,
    def: "自分の山札（デッキ）にカードを買い足して、少しずつ強くしていく仕組み。ドミニオンが元祖。",
  },
  {
    id: "engine-building",
    term: "エンジンビルド",
    aliases: ["拡大再生産"],
    cat: "メカニクス（仕組み）",
    link: true,
    def: "序盤に仕込んだ要素が、後半になるほど雪だるま式に効いてくる仕組み。“エンジン”を組み上げる感覚。",
  },
  {
    id: "set-collection",
    term: "セットコレクション",
    cat: "メカニクス（仕組み）",
    link: true,
    def: "決まった組み合わせ（セット）を集めると得点になる仕組み。同じ色をそろえる、などが典型。",
  },
  {
    id: "tile-placement",
    term: "タイル配置",
    cat: "メカニクス（仕組み）",
    link: true,
    def: "地形などが描かれたタイルを、辺のつながりに合わせて並べていく仕組み。カルカソンヌが代表。",
  },
  {
    id: "area-majority",
    term: "エリアマジョリティ",
    aliases: ["陣取り"],
    cat: "メカニクス（仕組み）",
    link: true,
    def: "ひとつの場所やエリアで、より多くのコマ（多数派）を持っている人が得点する“陣取り”の仕組み。",
  },
  {
    id: "auction",
    term: "せり",
    aliases: ["競り", "オークション"],
    cat: "メカニクス（仕組み）",
    link: true,
    def: "全員が同時・または順番に出し合って、いちばん高い（または条件に合う）人が獲得する競争のこと。",
  },
  {
    id: "bluff",
    term: "ブラフ",
    aliases: ["はったり", "心理戦"],
    cat: "メカニクス（仕組み）",
    link: true,
    def: "ウソやはったりで相手を惑わせる駆け引き。本当か嘘かを見破り合う心理戦。",
  },
  {
    id: "batting",
    term: "バッティング",
    aliases: ["かぶり"],
    cat: "メカニクス（仕組み）",
    link: true,
    def: "他の人と選択がかぶること。ゲームによっては、かぶると無効になる・損をするなどの効果があります。",
  },

  // よく出てくる名詞（全般）
  {
    id: "meeple",
    term: "ミープル",
    cat: "よく出てくる名詞",
    link: true,
    def: "人の形をした木のコマの愛称。地形やマスに置いて、そこの所有権や働き手を表します（カルカソンヌが有名）。",
  },
  {
    id: "supply",
    term: "サプライ",
    cat: "よく出てくる名詞",
    link: true,
    def: "全員が共通で使う“売り場”のこと。デッキ構築系では、ここからカードを買います（ドミニオンなど）。",
  },
  {
    id: "trash",
    term: "廃棄",
    aliases: ["トラッシュ"],
    cat: "よく出てくる名詞",
    link: true,
    def: "カードを山札（デッキ）から完全に取り除くこと。弱いカードを廃棄して、デッキを強くします。",
  },
  {
    id: "take-all",
    term: "総取り",
    cat: "よく出てくる名詞",
    link: true,
    def: "場に積まれたカードなどを、まとめて全部もらうこと。",
  },
  {
    id: "ascending",
    term: "昇順",
    aliases: ["小さい順"],
    cat: "よく出てくる名詞",
    link: true,
    def: "小さい数から大きい数へ、順番に並べること（例：ito は全員のカードを昇順に出せたらクリア）。",
  },

  // ───────────── ②ゲーム専用用語（各台本の後ろに載る） ─────────────
  // 宝石の煌めき
  {
    id: "prestige",
    term: "威信ポイント",
    aliases: ["名声"],
    game: "splendor",
    def: "このゲームの勝利点（⭐）のこと。だれかが合計15点に届くと終盤に入り、いちばん多い人が勝ち。発展カードと貴族タイルから手に入る。",
  },
  {
    id: "development-card",
    term: "発展カード",
    game: "splendor",
    def: "場から買うメインのカード。買うと左上の“ボーナス宝石”が永久割引になり、次からの買い物が安くなる。右上に威信ポイントが描かれていることも。",
  },
  {
    id: "noble",
    term: "貴族タイル",
    game: "splendor",
    def: "条件（ボーナス宝石の組み合わせ）を満たすと、手番の最後に自動で訪問してくるタイル。1枚につき⭐3点。買うものではありません。",
  },
  // チケット・トゥ・ライド
  {
    id: "locomotive",
    term: "機関車",
    game: "ticket-to-ride",
    def: "どの色の代わりにもなる万能カード（ワイルド）。ただし公開列から取ると、それだけで手番が終わります。",
  },
  {
    id: "destination",
    term: "目的地カード",
    game: "ticket-to-ride",
    def: "「A地点とB地点を結べ」というお題のカード。自分の路線でつなげば加点、つなげずに終わると減点されます。",
  },
  // ナンジャモンジャ
  {
    id: "call",
    term: "コール",
    game: "nanjamonja",
    def: "すでに名前をつけたキャラが再び出たとき、その名前を早く正しく言うこと。いちばん早くコールした人が場札を総取りします。",
  },
];

// ①辞典に載せる一般用語（game 指定が無いもの）
export const GENERAL = GLOSSARY.filter((g) => !g.game);

// ②あるゲームの専用用語を取り出す
export function gameTerms(gameId) {
  return GLOSSARY.filter((g) => g.game === gameId);
}

// 本文の自動リンク用マッチャー（一般用語のうち link: true のもの）。kind: "general"＝辞典へ。
export const MATCHERS = GENERAL.filter((g) => g.link !== false)
  .flatMap((g) =>
    [g.term, ...(g.aliases || [])].map((t) => ({ id: g.id, t, kind: "general" }))
  )
  .sort((a, b) => b.t.length - a.t.length);

// あるゲームのマッチャー：一般用語（辞典へ）＋そのゲームの専用用語（kind:"game"＝専門用語タブへ）。
// 長い語を優先してマッチさせる。
function matchersFor(gameId) {
  const game = gameTerms(gameId).flatMap((g) =>
    [g.term, ...(g.aliases || [])].map((t) => ({ id: g.id, t, kind: "game" }))
  );
  return [...game, ...MATCHERS].sort((a, b) => b.t.length - a.t.length);
}

// テキストを { text } / { id, kind, text } のセグメント配列にする。
// 各用語は、その文中で「初出の1回だけ」リンク対象にする（貼りすぎ防止）。
// gameId を渡すと、そのゲームの専用用語（kind:"game"）もリンク対象になる。
export function linkify(text, gameId) {
  const s = String(text || "");
  const matchers = gameId ? matchersFor(gameId) : MATCHERS;
  const used = new Set();
  const parts = [];
  const pushText = (ch) => {
    const last = parts[parts.length - 1];
    if (last && last.id === undefined) last.text += ch;
    else parts.push({ text: ch });
  };
  let i = 0;
  while (i < s.length) {
    let hit = null;
    for (const m of matchers) {
      if (used.has(m.id)) continue;
      if (s.startsWith(m.t, i)) {
        hit = m;
        break;
      }
    }
    if (hit) {
      parts.push({ id: hit.id, kind: hit.kind, text: s.substr(i, hit.t.length) });
      used.add(hit.id);
      i += hit.t.length;
    } else {
      pushText(s[i]);
      i += 1;
    }
  }
  return parts;
}
