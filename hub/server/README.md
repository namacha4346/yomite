# board-hub server（インスト台本 共有API）

フロント（Vite）から `/api` 経由で使う、最小のバックエンド。

## 起動

```
cd hub/server
npm install
npm start        # http://localhost:8787
```

別ターミナルでフロントを起動（Vite が /api をこのサーバーへプロキシ）:

```
cd hub
npm run dev
```

## API

- `GET  /api/health` … 死活確認
- `GET  /api/scripts` … 台本一覧（新しい順）
- `POST /api/scripts` … 追加（body は台本JSON・全10項目必須）→ 更新後の一覧
- `DELETE /api/scripts/:id` … 削除 → 更新後の一覧

保存は `server/data/summaries.json`（gitignore 済み）。
本番では SQLite / Postgres に差し替え、認証・決済を追加する想定。
`db.js` の4関数だけ差し替えれば移行できる。
