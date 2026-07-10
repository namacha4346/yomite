import { Link } from "react-router-dom";

// 免責・商標表記。権利者向けの窓口は独立ページ（/rights）へ。
export default function About() {
  return (
    <div className="page page--learn about">
      <span className="page-hurdle">このサイトについて</span>
      <h1 className="page-title">サービスと権利のこと</h1>
      <p className="page-lead">
        「ボードゲームひろば（仮）」は、ボードゲームを初心者でも遊べるようにするための、
        インスト（ルール説明）の“教え方”を共有するサービスです。
      </p>

      <section className="about-sec">
        <h2 className="about-h">このサイトは何をしている？</h2>
        <p className="about-text">
          各ゲームの「遊び方」を、運営や投稿者が<b>自分の言葉で書き起こした</b>インスト台本
          （教え方の手順）です。公式の説明書の文章・イラスト・図・写真などは
          <b>転載していません</b>。アイコンもすべて独自に用意したものです。
          あくまで“教えるときの補助”であり、ゲーム本体や公式説明書の代わりではありません。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">著作権・商標について</h2>
        <ul className="about-list">
          <li>
            ゲームの<b>「ルール（遊び方・システム）」そのものは著作権の保護対象ではない</b>ため、
            当サイトは独自の文章・アイコンで解説しています。
          </li>
          <li>
            各ゲームの<b>名称・ロゴ・説明書の文章・イラスト等の権利は、各権利者に帰属</b>します。
            記載しているゲーム名は各社の商標・登録商標です。
          </li>
          <li>
            当サイトは各メーカー・出版社・権利者とは<b>提携・公式の関係にありません</b>
            （非公式サービスです）。
          </li>
          <li>
            実際に遊ぶには、<b>公式の製品をご購入ください</b>。各ゲームのページから
            購入・検索ページへのリンクを用意しています。
          </li>
        </ul>
      </section>

      <section className="about-sec">
        <h2 className="about-h">内容の正確さについて</h2>
        <p className="about-text">
          台本は初心者が教えやすいことを重視しています。ルールの誤りや分かりにくい点に
          気づかれた場合は、各台本のコメントからお知らせください。正しい遊び方は
          公式の説明書が基準です。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">権利者・出版社の方へ</h2>
        <p className="about-text">
          自社タイトルの掲載停止・修正のご要望や、公式パートナーのご相談は、専用の窓口を
          ご用意しています。
          {" "}
          <Link className="about-mail" to="/rights">
            権利者・出版社の方へ →
          </Link>
        </p>
      </section>

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}
