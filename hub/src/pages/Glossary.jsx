import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GENERAL } from "../script/glossary.js";

// カテゴリの表示順（ここに載るのはボードゲーム全般で使う一般用語）
const CATS = ["基本の言葉", "メカニクス（仕組み）", "よく出てくる名詞"];

// ボードゲーム用語辞典。台本中の用語リンク（/glossary?t=<id>）から飛んでくる。
export default function Glossary() {
  const [params] = useSearchParams();
  const target = params.get("t");
  const refs = useRef({});

  // 指定の用語へスクロール＆ハイライト
  useEffect(() => {
    if (!target) return;
    const el = refs.current[target];
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.classList.add("term-hit");
      const t = setTimeout(() => el.classList.remove("term-hit"), 1600);
      return () => clearTimeout(t);
    }
  }, [target]);

  const grouped = CATS.map((cat) => ({
    cat,
    items: GENERAL.filter((g) => g.cat === cat),
  }));

  return (
    <div className="page page--learn glossary">
      <span className="page-hurdle">用語辞典</span>
      <h1 className="page-title">ボードゲーム用語辞典</h1>
      <p className="page-lead">
        ボードゲーム全般で使う言い回しや名詞をまとめました。台本の本文で色のついた語を
        タップすると、ここへ来られます。なお、そのゲームだけの用語（例：宝石の煌めきの
        「威信ポイント」）は、各台本の一番後ろ「専門用語」タブにまとめています。
      </p>

      {grouped.map((group) => (
        <section className="gloss-sec" key={group.cat}>
          <h2 className="gloss-cat">{group.cat}</h2>
          <dl className="gloss-list">
            {group.items.map((g) => (
              <div
                key={g.id}
                className="gloss-item"
                ref={(el) => (refs.current[g.id] = el)}
              >
                <dt className="gloss-term">
                  {g.term}
                  {g.aliases && g.aliases.length > 0 && (
                    <span className="gloss-alias">
                      （{g.aliases.join("・")}）
                    </span>
                  )}
                </dt>
                <dd className="gloss-def">{g.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <Link to="/" className="page-back">← トップに戻る</Link>
    </div>
  );
}
