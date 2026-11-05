import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUser } from "../services/fetch";
import { loginUser, registerUser } from "../services/mutations";
import { AppContext } from "./appContext";

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const data = await fetchUser();

          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        } catch {
          logout();
        }
      }

      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    const { token: receivedToken, user: receivedUser } = data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem("token", receivedToken);
    localStorage.setItem("user", JSON.stringify(receivedUser));
  };

  const register = async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    const { token: receivedToken, user: receivedUser } = data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem("token", receivedToken);
    localStorage.setItem("user", JSON.stringify(receivedUser));
  };

  const value = {
    navigate,
    location,
    token,
    setToken,
    user,
    setUser,
    loading,
    setLoading,
    login,
    register,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
