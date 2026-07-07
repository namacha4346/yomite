// 作られたサマリーを「1枚の早見表（プレイヤーエイド）」として表示する部品。
// 3部品（手番でできること／アイコン早見表／終了条件）を、こだわったレイアウトで並べる。
export default function SummaryCard({ summary, onDelete, onPrint }) {
  const { gameTitle, turnActions = [], icons = [], endCondition, official } = summary;
  const actions = turnActions.filter(Boolean);
  const glossary = icons.filter((g) => g.icon || g.meaning);

  return (
    <article className="scard">
      {/* ヘッダー帯 */}
      <header className="scard-band">
        <div className="scard-band-main">
          <span className="scard-kicker">サマリー早見表</span>
          <h3 className="scard-title">{gameTitle || "（無題のサマリー）"}</h3>
        </div>
        {official && <span className="scard-official">公式</span>}
      </header>

      <div className="scard-body">
        {/* ① 手番でできること：番号付きステップ（主役） */}
        <section className="scard-sec">
          <h4 className="scard-h">手番でできること</h4>
          <ol className="scard-steps">
            {actions.map((a, i) => (
              <li key={i} className="step">
                <span className="step-no">{i + 1}</span>
                <span className="step-text">{a}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ② アイコン早見表：2列グリッド、絵文字をチップに */}
        {glossary.length > 0 && (
          <section className="scard-sec">
            <h4 className="scard-h">アイコン早見表</h4>
            <ul className="scard-icons">
              {glossary.map((g, i) => (
                <li key={i} className="gitem">
                  <span className="gitem-ic">{g.icon}</span>
                  <span className="gitem-mean">{g.meaning}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ③ 終了条件：ゴールの枠で締める */}
        <section className="scard-sec">
          <h4 className="scard-h">終了条件</h4>
          <div className="scard-end">
            <span className="scard-end-flag" aria-hidden="true">🏁</span>
            <p className="scard-end-text">{endCondition}</p>
          </div>
        </section>
      </div>

      {(onPrint || onDelete) && (
        <footer className="scard-foot">
          {onPrint && (
            <button className="linkbtn" onClick={() => onPrint(summary)}>
              🖨 印刷／PDF
            </button>
          )}
          {onDelete && (
            <button className="linkbtn" onClick={() => onDelete(summary.id)}>
              削除
            </button>
          )}
        </footer>
      )}
    </article>
  );
}
