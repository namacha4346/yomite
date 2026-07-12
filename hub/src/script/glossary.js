// ボードゲーム用語辞典のデータ。
// 台本本文に出てくる「独特の言い回し・名詞」を、初心者向けに解説する。
// link: true の用語は、台本本文で初出のときだけ自動で辞典へリンクする
// （手番・ラウンド等のごく基本的な語は、辞典には載せるがリンクはしない＝link:false）。

export const GLOSSARY = [
  // ── 基本の言葉 ──
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

  // ── メカニクス（ゲームの仕組み） ──
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

  // ── ゲーム独特の名詞 ──
  {
    id: "meeple",
    term: "ミープル",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "人の形をした木のコマの愛称。カルカソンヌで地形に置いて、その場所の所有権を主張します。",
  },
  {
    id: "supply",
    term: "サプライ",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "全員が共通で使う“売り場”のこと。ドミニオンでは、ここからカードを買います。",
  },
  {
    id: "prestige",
    term: "威信ポイント",
    aliases: ["名声"],
    cat: "ゲーム独特の名詞",
    link: true,
    def: "宝石の煌めきでの勝利点（⭐）のこと。合計15点に届いた人が出ると終盤に入ります。",
  },
  {
    id: "development-card",
    term: "発展カード",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "宝石の煌めきで買うカード。買うと“ずっと使える割引”になり、右上に威信ポイントが描かれていることも。",
  },
  {
    id: "noble",
    term: "貴族タイル",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "宝石の煌めきで、条件を満たすと自動で訪問してくるタイル。1枚につき⭐3点。買うものではありません。",
  },
  {
    id: "trash",
    term: "廃棄",
    aliases: ["トラッシュ"],
    cat: "ゲーム独特の名詞",
    link: true,
    def: "カードを山札（デッキ）から完全に取り除くこと。弱いカードを廃棄して、デッキを強くします。",
  },
  {
    id: "locomotive",
    term: "機関車",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "チケット・トゥ・ライドの万能カード（ワイルド）。どの色の代わりにもなります。",
  },
  {
    id: "destination",
    term: "目的地カード",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "チケット・トゥ・ライドで「A地点とB地点を結べ」というお題のカード。達成すれば加点、未達なら減点。",
  },
  {
    id: "call",
    term: "コール",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "ナンジャモンジャで、既に名付けたキャラが再び出たとき、その名前を早く正しく言うこと。早い者勝ち。",
  },
  {
    id: "take-all",
    term: "総取り",
    cat: "ゲーム独特の名詞",
    link: true,
    def: "場に積まれたカードなどを、まとめて全部もらうこと。",
  },
  {
    id: "ascending",
    term: "昇順",
    aliases: ["小さい順"],
    cat: "ゲーム独特の名詞",
    link: true,
    def: "小さい数から大きい数へ、順番に並べること。ito では全員のカードを昇順に出せたらクリア。",
  },
];

// 自動リンク用のマッチャー：term＋aliases を長い順に並べる（長い語を優先）
export const MATCHERS = GLOSSARY.filter((g) => g.link !== false)
  .flatMap((g) => [g.term, ...(g.aliases || [])].map((t) => ({ id: g.id, t })))
  .sort((a, b) => b.t.length - a.t.length);

// テキストを { text } / { id, text } のセグメント配列にする。
// 各用語は、その文中で「初出の1回だけ」リンク対象にする（貼りすぎ防止）。
export function linkify(text) {
  const s = String(text || "");
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
    for (const m of MATCHERS) {
      if (used.has(m.id)) continue;
      if (s.startsWith(m.t, i)) {
        hit = m;
        break;
      }
    }
    if (hit) {
      parts.push({ id: hit.id, text: s.substr(i, hit.t.length) });
      used.add(hit.id);
      i += hit.t.length;
    } else {
      pushText(s[i]);
      i += 1;
    }
  }
  return parts;
}
