// Client / src / context / AppContext.jsx
import { AppContext } from "./appContext";
import { useLocation, useNavigate } from "react-router-dom";

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const value = { navigate, location };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
