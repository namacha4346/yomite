import { Link } from "react-router-dom";

// 利用規約。法務（staff-4）の骨子に基づくたたき台。
// ※本番公開前に、事業者名・連絡先の確定と、弁護士レビューを推奨。
export default function Terms() {
  return (
    <div className="page page--place about">
      <span className="page-hurdle">利用規約</span>
      <h1 className="page-title">利用規約</h1>
      <p className="page-lead">
        「ボードゲームひろば（仮）」（以下「当サイト」）をご利用いただく前に、
        以下の規約をお読みください。ご利用をもって、本規約に同意したものとみなします。
      </p>

      <section className="about-sec">
        <h2 className="about-h">1. サービスの位置づけ</h2>
        <p className="about-text">
          当サイトは、ボードゲームの遊び方を運営・投稿者が自分の言葉で書き起こした
          <b>非公式のインスト（ルール説明）補助サービス</b>です。ゲーム本体や公式
          説明書の代替ではありません。各メーカー・出版社とは提携・公式の関係にありません。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">2. 免責</h2>
        <p className="about-text">
          当サイトの台本・早見表・AIによる回答は、正確性・完全性を保証しません。
          実際の遊び方は<b>各ゲームの公式説明書が基準</b>です。ご利用によって生じた
          いかなる結果についても、当サイトは責任を負いません。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">3. ユーザー投稿について</h2>
        <p className="about-text">
          台本・コメント等を投稿する方は、次の各号に同意するものとします。
        </p>
        <ul className="about-list">
          <li>投稿は自分の言葉で書いたオリジナルであり、公式説明書等の文章・図・画像を転載していないこと。</li>
          <li>第三者の著作権・商標権その他の権利を侵害しないこと。</li>
          <li>当サイトが投稿内容を掲載・表示・改変できること（非独占的な利用許諾の付与）。</li>
          <li>規約に違反する投稿を、当サイトが予告なく非表示・削除できること。</li>
        </ul>
      </section>

      <section className="about-sec">
        <h2 className="about-h">4. 禁止事項</h2>
        <p className="about-text">
          他者の説明書の転載、なりすまし、公式を詐称する行為、法令・公序良俗に反する
          行為を禁止します。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">5. 権利の帰属</h2>
        <p className="about-text">
          各ゲームの名称・ロゴ・説明書の文章・イラスト等の権利は各権利者に帰属します。
          当サイトが作成した文章・アイコン等の権利は当サイトに帰属します。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">6. 掲載の停止・削除のご相談</h2>
        <p className="about-text">
          権利者からの掲載停止・修正のご要望、権利侵害のご報告は
          <Link className="about-mail" to="/rights">
            権利者・出版社の方へ
          </Link>
          の窓口で受け付けます。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">7. サービスの変更・停止／準拠法</h2>
        <p className="about-text">
          当サイトは、内容の変更・提供の停止を行うことがあります。本規約は日本法に
          準拠し、紛争は当サイト運営者の所在地を管轄する裁判所を専属的合意管轄とします。
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
