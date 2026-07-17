import { Link } from "react-router-dom";

// プライバシーポリシー。法務（staff-4）の骨子に基づくたたき台。
// ※AI質問はユーザー入力を外部AIサービスへ送信するため、その明示が要点。
export default function Privacy() {
  return (
    <div className="page page--place about">
      <span className="page-hurdle">プライバシーポリシー</span>
      <h1 className="page-title">プライバシーポリシー</h1>
      <p className="page-lead">
        「ボードゲームひろば（仮）」（以下「当サイト」）における、情報の取り扱いについて
        説明します。
      </p>

      <section className="about-sec">
        <h2 className="about-h">1. 取得する情報</h2>
        <ul className="about-list">
          <li>アカウント情報（ハンドル名など、ログインして利用する場合）</li>
          <li>AI質問で入力された質問テキスト</li>
          <li>アクセスログ・利用状況（品質向上のため）</li>
        </ul>
      </section>

      <section className="about-sec">
        <h2 className="about-h">2. 利用目的</h2>
        <p className="about-text">
          サービスの提供（台本の表示・AI回答の生成）、品質の改善、不正防止のために
          利用します。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">3. 外部サービスへの送信（重要）</h2>
        <p className="about-text">
          AIへの質問機能では、回答を生成するために、入力された<b>質問テキストを外部の
          AIサービスへ送信</b>します。<b>個人情報や、公開されたくない内容は入力しないで
          ください。</b>
        </p>
        <p className="about-text about-todo">
          ※ 共有デモ版では、AIへは送信せず、台本データをもとに端末内で簡易回答を生成します
          （外部送信は行いません）。外部AIへの送信は、本番のAI回答モードでのみ行われます。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">4. 保存・削除・お問い合わせ</h2>
        <p className="about-text">
          保存した情報の削除・開示のご希望は、
          <Link className="about-mail" to="/rights">
            お問い合わせ窓口
          </Link>
          までご連絡ください。ブラウザのローカルストレージを、ログイン状態や下書きの
          保持に利用することがあります。
        </p>
        <p className="about-text about-todo">
          ※ 事業者名・連絡先・制定日は本番公開時に確定します。本ページはたたき台であり、
          公開前に専門家（弁護士）の確認を推奨します。
        </p>
      </section>

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}
