// サマリーは「表（front）／裏（back）」の2面を持てる。
// 各セクションがどちらの面かを side フィールドで持つ。
// 既定は定番の表裏構成：手番=表・終了=表／アイコン早見表=裏。
// 古い保存データ（side なし）でも壊れないよう、ここで既定値を補う。
export function withSides(s) {
  return {
    ...s,
    turnActionsSide: s.turnActionsSide || "front",
    endConditionSide: s.endConditionSide || "front",
    iconsSide: s.iconsSide || "back",
  };
}

export const SIDES = [
  { key: "front", label: "表" },
  { key: "back", label: "裏" },
];
