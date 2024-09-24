// Protecting routes
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Protected = ({ element }) => {
  const { isAuthenticated, userRole } = useAuth();

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default Protected;
