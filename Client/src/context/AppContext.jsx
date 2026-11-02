// Client / src / context / AppContext.jsx
import { AppContext } from "./appContext";

export const AppProvider = ({ children }) => {
  const value = {};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
