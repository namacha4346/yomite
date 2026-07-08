import { createContext, useContext } from "react";

// アプリ全体で現在のアカウントを共有する。
// value = {
//   account: {handle, name} | null,   // 未ログインは null（閲覧は誰でも可）
//   login: (account) => void,
//   logout: () => void,
//   requireLogin: () => void,          // ログインが要る操作で呼ぶ（モーダルを開く）
// }
export const AuthContext = createContext({
  account: null,
  login: () => {},
  logout: () => {},
  requireLogin: () => {},
});
export const useAuth = () => useContext(AuthContext);
