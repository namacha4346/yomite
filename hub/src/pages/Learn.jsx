import Placeholder from "./Placeholder.jsx";

// インストのハードル担当。中身は後から作り込む（今は仮置き）。
export default function Learn() {
  return (
    <Placeholder
      accent="learn"
      hurdle="インストのハードル"
      title="教わる／教える"
      lead="ルール説明を、初心者でもできるように。"
      todo={[
        "遊ぶゲームを選ぶ",
        "声・すごろく・紙芝居でルールを案内",
        "説明する人向けの台本",
      ]}
    />
  );
}
