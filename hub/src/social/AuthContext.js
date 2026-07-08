import { createContext, useContext } from "react";

// アプリ全体で現在のアカウントを共有する。
// value = { account: {handle, name}, logout: () => void }
export const AuthContext = createContext({ account: null, logout: () => {} });
export const useAuth = () => useContext(AuthContext);
