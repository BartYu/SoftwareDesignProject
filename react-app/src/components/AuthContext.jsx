import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
