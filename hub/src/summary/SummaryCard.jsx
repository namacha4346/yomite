// 作られたサマリーを「1枚のカンニングペーパー」として表示する部品。
// 3部品（手番でできること／アイコン早見表／終了条件）を並べる。
export default function SummaryCard({ summary, onDelete, onPrint }) {
  const { gameTitle, turnActions = [], icons = [], endCondition, official } = summary;

  return (
    <article className="scard">
      <header className="scard-head">
        <h3 className="scard-title">{gameTitle || "（無題のサマリー）"}</h3>
        {official && <span className="scard-official">公式</span>}
      </header>

      <section className="scard-sec">
        <h4 className="scard-h">手番でできること</h4>
        <ul className="scard-actions">
          {turnActions.filter(Boolean).map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="scard-sec">
        <h4 className="scard-h">アイコン早見表</h4>
        <ul className="scard-icons">
          {icons.filter((g) => g.icon || g.meaning).map((g, i) => (
            <li key={i}>
              <span className="scard-ic">{g.icon}</span>
              <span className="scard-mean">{g.meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="scard-sec">
        <h4 className="scard-h">終了条件</h4>
        <p className="scard-end">{endCondition}</p>
      </section>

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
