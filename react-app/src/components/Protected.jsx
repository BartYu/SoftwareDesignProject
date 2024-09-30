// Protecting routes
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Protected = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default Protected;
