# ヨミテ — Claude Code 引き継ぎ書

> ⚠️ **【レガシー】このドキュメントは旧プロトタイプ「ヨミテ」（`yomite.tsx`）の引き継ぎ資料です。**
> 現行アプリは `hub/` で、声・すごろく・紙芝居・ルールQ&A・CSV取り込み等の
> ここに書かれた機能は `hub/` には**含まれていません**。現行の仕様はルートの
> `README.md` を参照してください。以下は当時の記録として残しています。


ボードゲームのインストを「声」「すごろく」「紙芝居」で伝え、インスト者が台本を書いて
PDF出力もできるアプリ。Claudeとのチャット（アーティファクト）で試作したものを、
ここから Claude Code で本物のWebアプリに育てる。

ソースは `yomite.jsx`（Reactの単一コンポーネント）。

---

## 1. まず動かす（セットアップ）

Claude Code に、このフォルダで以下をやってもらえばOK。

```
npm create vite@latest yomite -- --template react
cd yomite
npm install
```

- `yomite.jsx` の中身を `src/App.jsx` に丸ごと貼り替える
- `src/index.css` の中身は空にする（スタイルは App 内の <style> で完結しているため）
- `npm run dev` で起動 → ブラウザで確認

※ 追加ライブラリは不要（React と、ブラウザ標準の音声合成API・印刷機能だけで動く）。

---

## 2. アーティファクト専用 → 作り替えが必要な2か所

### (A) 保存機能：`window.storage` を localStorage に置き換える

`window.storage` はチャットのアーティファクト専用。普通のアプリでは動かないので、
`src/storage.js` を作って差し替える。

```js
// src/storage.js
export const storage = {
  async get(key) {
    const v = localStorage.getItem(key);
    return v == null ? null : { key, value: v };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
  async list(prefix = "") {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
    return { keys, prefix };
  },
};
```

App.jsx の先頭で `import { storage } from "./storage";` し、
コード内の `window.storage` を `storage` に置き換える（数か所）。

### (B) ルールQ&A：AI呼び出しは「サーバー経由」にする

現状、`https://api.anthropic.com/v1/messages` をブラウザから直接叩いている。
これはアーティファクト内だからキー無しで動いていただけで、普通のアプリでは
**CORSで失敗する＋APIキーが必要**。

重要：**APIキーを画面（フロント）側のコードに書いてはいけない**（盗まれる）。
正しくは、キーを持った小さなサーバー（中継）を立てて、そこを経由させる。

- 手軽な選択肢：Cloudflare Workers / Vercel Functions / 小さな Express サーバー など
- フロントは自前サーバーの `/api/ask` を叩く → サーバーが Anthropic API に転送して返す
- App.jsx の QAPanel の中の `fetch("https://api.anthropic.com/...")` を
  `fetch("/api/ask", ...)` に変更する

Claude Code に「Q&A用のサーバー中継を作って、フロントをそれ経由に変えて」と頼めばよい。
（まずは動かすだけなら、Q&Aはエラー表示のままでも他機能は動く）

---

## 3. そのまま動く部分（変更不要）

- 音声読み上げ（Web Speech API / speechSynthesis）… 普通のブラウザで動く
- すごろく／紙芝居の表示・操作
- PDF書き出し（ブラウザの印刷→PDF保存）
- 日本語フォント（Google Fonts を CSS の @import で読み込み）

---

## 4. 今あるもの（実装済み）

- 入り口で「はじめての人 / インストする人」を選んで画面を出し分け
- 検索つきカタログ（人数・年齢・メカニクスのタグで絞り込み）
- 紙芝居：4章（どんなゲーム? / 準備とゴール / 手番ですること / よくある勘違い）。
  1枚ずつ手動送り＋その絵の音声を再生
- すごろく：5項目をコマが進みながら音声で読む（1文ごとに改行表示で読みやすく）
- ルールQ&A：そのゲームのルールだけを根拠にAIが回答（※要サーバー化）
- 台本エディタ：5項目＋メタ情報を編集、新規作成・複製・削除、自動保存（※要storage置換）
- AI紙芝居の自動コマ割り：台本（手番の流れ等）からAIが紙芝居を生成（※要サーバー化）
- スプレッドシート（CSV/TSV）でゲームをまとめて取り込み（テンプレDL・プレビュー付き）
- PDF書き出し
- 音声：音声ファイルがあれば再生、無ければWeb Speech（高品質TTS差し込みの土台済み）
- 紙芝居の絵：画像があれば表示、無ければSVGの図（AI画像/写真差し込みの土台済み）

サンプルは4ゲーム（ナンジャモンジャ／ごきぶりポーカー／ハゲタカのえじき／ウイングスパン）。
AIのルールQ&A・自動コマ割りには「本文にないことは足さない（作文しない）」という正確さの
ガードを入れてある。

---

## 5. これからやりたいこと（ロードマップ）

- ルールを貼ると台本5項目に「整形」する取り込み（作文せず整えるだけ＝正確さの最大の担保）
- サマリー表裏1枚（手番の流れ＋アイコン説明）の生成と、ユーザー間での共有
- 高品質TTS（音声ファイル）とAI画像/実物写真の実接続（バックエンド）
- ユーロゲーム向けの紙芝居シーン（盤への配置・エサ/サイコロ・卵・エンジン）を追加
- 口調プリセット（やさしい／きっちり 等）をAI機能に適用
- 本物の保存・アカウント・共有（バックエンド/DB）
- お気に入り（★）・並び順・人数で出し分け

---

## 6. 設計メモ

- ゲーム1件のデータ構造：
  `{ id, title, titleKana, summary, players{min,max}, time{min,max}, minAge,
     mechanics[], cover, inst{ world, goal, setup, flow, pitfalls } }`
- 紙芝居データ：`STORYBOARDS[gameId].chapters[].frames[]`（frame は kind と cap などを持つ）
- セクションの色は `TOKENS`、カバーの色味は `COVER_COLOR` を参照

### 音声ファイル（高品質TTS）の差し込み口 ＝ すでに土台あり

読み上げは「音声ファイルがあればそれを再生、無ければ Web Speech で読む」作りになっている。
あとで高品質TTS（OpenAI / ElevenLabs / Azure 等）で**事前生成した音声ファイルのURL**を
下記に入れるだけで、自動で綺麗な声に切り替わる。

- すごろく：`game.audio = { world, goal, setup, flow, pitfalls }`（各値が音声URL。任意）
- 紙芝居：各 `frame.audio`（音声URL。任意）

おすすめ運用：テキストは固定なので、台本確定時に**一度だけ生成して保存**（オフライン再生＆低コスト）。
生成は API キーが要るのでサーバー側（フロントにキーを置かない）。

### 紙芝居の絵（AI画像）の差し込み口 ＝ すでに土台あり

紙芝居は「`frame.image` があればその画像を表示、無ければ手描きSVGの図」を出す作りになっている。
あとで画像のURLを `frame.image` に入れるだけで、絵が差し替わる。

**AI画像生成をClaude Codeで繋ぐ手順（推奨）**
1. 画像生成API（OpenAI gpt-image-1 / DALL·E、Stability、Google Imagen 等）をサーバー側に用意（キーはサーバーに置く）
2. コマごとに「画像プロンプト」を作る。質と統一感のため、固定のスタイル指定＋場面説明を組み合わせる。例：
   `フラットなベクターイラスト、温かみのある紙のような色、太い輪郭、ボードゲームの説明図。場面：「(frame.cap)」。ゲーム：(game.title)。文字は入れない。`
3. 生成画像を保存し、URLを `frame.image` に入れる（台本確定時に一度だけ＝オフライン表示・低コスト）

**重要な注意（正確さ）**
- AI画像は、実際のゲームと違う部品を描きがち。ルールを教える用途では「綺麗だが誤った絵」は逆効果。
- 対策：プロンプトで部品を具体指定する／"説明図・記号的"に寄せる／本当に正確さが要る場面は
  **インスト者が撮った実物写真**を `frame.image` に入れる（権利的にも安全で、いちばんリアル）。
- スタイルを全コマで統一（同じ指定を使う）と、紙芝居としてまとまる。
