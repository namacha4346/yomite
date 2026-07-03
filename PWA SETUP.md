# ヨミテ — PWA化の準備

「ホーム画面に追加」できて、アプリのように全画面で起動でき、オフラインでも基本機能が
動く状態（PWA）にするための手順。Claude Code に渡して使う想定。
前提：HANDOFF.md の通り Vite + React のWebアプリになっていること。

---

## 1. PWAに必要なもの（ざっくり）

1. **manifest（アプリ情報）**… 名前・アイコン・色・全画面起動の設定
2. **service worker（オフライン対応）**… アプリ本体をキャッシュして、ネットが無くても開ける
3. **アイコン**… 192 / 512 / マスカブル（丸く切られても欠けない）版
4. **HTTPSで公開**… PWAはHTTPS必須。無料で取れる（後述）

Vite なら **`vite-plugin-pwa`** を入れると 1〜2 をほぼ自動でやってくれる。これを使うのが楽。

---

## 2. 先に決めること（あなたの判断）

- **アプリ名**：正式「ヨミテ — ボードゲームのインスト」／短縮「ヨミテ」
- **テーマ色**：`#1F3A3D`（petrol）／背景 `#241B13`（卓の色）
- **アイコン**：同梱の `yomite-icon.svg` を元に各サイズを生成（自作してもOK）
- **公開先（無料・HTTPS）**：Netlify / Vercel / Cloudflare Pages のどれか1つ
  - いちばん簡単なのは Netlify か Vercel。GitHub と連携すると、更新が自動で反映される

---

## 3. Claude Code でのやり方（vite-plugin-pwa）

### (1) プラグインを入れる

```
npm install -D vite-plugin-pwa
```

### (2) vite.config.js に設定を足す

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "ヨミテ — ボードゲームのインスト",
        short_name: "ヨミテ",
        description: "ボードゲームのルールを、声・すごろく・紙芝居で。",
        lang: "ja",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#1F3A3D",
        background_color: "#241B13",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      }
    })
  ]
});
```

### (3) アイコンを用意する

`yomite-icon.svg` を元に PNG を3つ作って `public/` に置く：
`icon-192.png` / `icon-512.png` / `icon-512-maskable.png` / `apple-touch-icon.png`(180px)

- Claude Code に「この svg から各サイズの png を作って public に置いて」と頼めばよい
- もしくは `@vite-pwa/assets-generator` を使うと、元画像1枚から全サイズを自動生成できる

### (4) index.html にメタタグを足す（iOS対応）

```html
<meta name="theme-color" content="#1F3A3D" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="ヨミテ" />
```

### (5) ビルドして公開

```
npm run build
```

`dist/` を Netlify / Vercel / Cloudflare Pages にアップ（GitHub連携が楽）。
公開URLをスマホで開き、ブラウザのメニューから「ホーム画面に追加」で確認。

---

## 4. ヨミテ特有のオフライン方針

ヨミテはオフラインに強い。**ネットが無くても次は動く**ようにしておく：

- カタログ（一覧・検索・絞り込み）
- 紙芝居（図のめくり）／すごろく
- 台本の編集・新規作成・保存（localStorage）
- 音声の読み上げ（Web Speech：端末内の声を使うのでオフラインでも鳴る）
- PDF書き出し

**ネットが必要（オフラインでは使えない）**：
- ルールQ&A（AI呼び出し）
- AIで紙芝居をつくる（AI呼び出し）

→ オフライン時はこの2つに「インターネットに接続すると使えます」と出すのが親切。
ボドゲ会の会場がWi-Fi弱くても、核となる機能が動くのは大きな強み。

---

## 5. iOS（iPhone/iPad）メモ

- Safari の「ホーム画面に追加」でインストールできる（全画面起動）
- `apple-touch-icon` と `apple-mobile-web-app-*` メタが必要（上の (4)）
- iOS は service worker や通知に制限あり。まずは「全画面で起動・基本オフライン」を目標に

---

## 6. Claude Code に貼るプロンプト

```
HANDOFF.md と PWA_SETUP.md を読んでください。
この Vite + React アプリ（ヨミテ）を PWA にして、スマホのホーム画面に追加でき、
オフラインでも基本機能が動くようにしたいです。PWA_SETUP.md の手順に沿って：

1. vite-plugin-pwa を入れて設定する（manifest は PWA_SETUP.md の内容で）
2. 同梱の yomite-icon.svg から icon-192 / icon-512 / icon-512-maskable /
   apple-touch-icon の png を作って public に置く
3. index.html に theme-color や apple-touch-icon などのメタを追加
4. オフラインでも「カタログ・紙芝居・すごろく・編集・PDF」が動くようにし、
   ルールQ&AとAI生成はオフライン時に「接続すると使えます」と表示する
5. npm run build して、ローカルでPWAとしてインストールできることを確認する

プログラミング初心者なので、各ステップで何をしているか簡単に説明しながら進めてください。
最後に、Netlify か Vercel での公開手順も教えてください。
```

---

## 7. 順番チェックリスト

- [ ] HANDOFF.md の通り、まずWebアプリとしてローカルで動く（npm run dev）
- [ ] 保存を localStorage に置き換え済み
- [ ] vite-plugin-pwa を導入・設定
- [ ] アイコン（192 / 512 / maskable / apple-touch）を public に配置
- [ ] index.html にメタタグ追加
- [ ] オフライン時、Q&A・AI生成に案内表示
- [ ] npm run build → 公開（HTTPS）
- [ ] スマホで「ホーム画面に追加」して全画面起動を確認
