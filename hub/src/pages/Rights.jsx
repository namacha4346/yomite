import { Link } from "react-router-dom";

// 権利者・出版社の方向けの独立ページ（掲載停止・修正の窓口／パートナー相談）。
// ※お問い合わせ先は本番で設定してください（空なら「準備中」と表示）。
const CONTACT_EMAIL = "";

export default function Rights() {
  return (
    <div className="page page--place about">
      <span className="page-hurdle">権利者・出版社の方へ</span>
      <h1 className="page-title">掲載の停止・修正のご相談</h1>
      <p className="page-lead">
        「ボードゲームひろば（仮）」は、ボードゲームの遊び方を運営や投稿者が
        <b>自分の言葉で書き起こした</b>非公式のインスト補助サービスです。
        公式説明書の文章・イラスト・図は転載していません。
      </p>

      <section className="about-sec" id="rights">
        <h2 className="about-h">掲載の停止・修正（オプトアウト）</h2>
        <p className="about-text">
          自社タイトルの掲載停止・修正のご要望や、内容についてのご指摘がありましたら、
          下記の窓口までご連絡ください。<b>確認のうえ、速やかに対応（取り下げ・修正）</b>します。
          ご連絡の際は、対象のゲーム名とご要望内容をお知らせいただけると助かります。
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
        <h2 className="about-h">公式パートナー・監修のご相談</h2>
        <p className="about-text">
          公式台本としての掲載・監修、正規取扱店や購入導線との連携など、
          前向きなご提案も歓迎します。上記の窓口までお気軽にご連絡ください。
        </p>
      </section>

      <section className="about-sec">
        <h2 className="about-h">当サイトの位置づけ</h2>
        <p className="about-text">
          著作権・商標の扱い（ルール解説は独自の文章・アイコンで作成、名称・ロゴ等は
          各権利者に帰属、各社との提携・公式関係なし）は
          <Link className="about-mail" to="/about">
            このサイトについて
          </Link>
          にまとめています。
        </p>
      </section>

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}
