import Placeholder from "./Placeholder.jsx";

// 場所のハードル担当。中身は後から作り込む（今は仮置き）。
export default function Place() {
  return (
    <Placeholder
      accent="place"
      hurdle="場所のハードル"
      title="集まる"
      lead="近くの卓・お店を見つけて、遊ぶ場所へ。"
      todo={[
        "近くのボードゲームカフェ・スペースを探す",
        "卓（遊ぶ集まり）の募集・参加",
        "一緒に遊ぶ人とのマッチング",
      ]}
    />
  );
}
