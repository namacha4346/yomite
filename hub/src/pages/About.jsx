import { Link } from "react-router-dom";

// 免責・商標表記＋権利者向けオプトアウト窓口。
// ※お問い合わせ先は本番で設定してください（空なら「準備中」と表示）。
const CONTACT_EMAIL = "";

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

      <section className="about-sec" id="rights">
        <h2 className="about-h">権利者・出版社の方へ（掲載の停止・修正）</h2>
        <p className="about-text">
          自社タイトルの掲載停止・修正のご要望や、内容についてのご指摘がありましたら、
          下記の窓口までご連絡ください。<b>確認のうえ、速やかに対応（取り下げ・修正）</b>します。
          また、公式パートナーとしての掲載・監修のご相談も歓迎します。
        </p>
        <p className="about-contact">
          お問い合わせ先：{" "}
          {CONTACT_EMAIL ? (
            <a className="about-mail" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          ) : (
            <span className="about-todo">（準備中・本番公開時に設定します）</span>
          )}
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">内容の正確さについて</h2>
        <p className="about-text">
          台本は初心者が教えやすいことを重視しています。ルールの誤りや分かりにくい点に
          気づかれた場合は、各台本のコメントや上記の窓口からお知らせください。正しい遊び方は
          公式の説明書が基準です。
        </p>
      </section>

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}
