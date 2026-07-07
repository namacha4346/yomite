import Placeholder from "./Placeholder.jsx";

// 認知のハードル担当。中身は後から作り込む（今は仮置き）。
export default function Discover() {
  return (
    <Placeholder
      accent="discover"
      hurdle="認知のハードル"
      title="出会う"
      lead="自分に合う一作と出会う、はじめの一歩。"
      todo={[
        "かんたん診断でおすすめを表示",
        "人数・時間・気分でゲームを紹介",
        "遊んだ記録・シェア",
      ]}
    />
  );
}
