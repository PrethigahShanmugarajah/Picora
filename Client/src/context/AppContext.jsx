// Client / src / context / AppContext.jsx
import { AppContext } from "./appContext";
import { useNavigate } from "react-router-dom";

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const value = { navigate };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
