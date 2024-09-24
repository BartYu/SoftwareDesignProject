import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmission = async (event) => {
    event.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    }
    if (isValid) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          setEmailError(responseData.error);
          setPasswordError(responseData.error);
          setPassword("");
          return;
        }
        const { role } = responseData;
        login(role);
        navigate("/profile");
      } catch (error) {
        setEmailError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const loginCheck = "Not registered yet? ";

  return (
    <div className="addUser">
      <h3> Welcome Back! </h3>
      <form className="addUserForm" onSubmit={handleSubmission}>
        <div className="inputGroup">
          <label htmlFor="email">Username</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            autoComplete="off"
            placeholder="Email"
            className={`form-control ${emailError ? "is-invalid" : ""}`}
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
            autoComplete="off"
            placeholder="Password"
            className={`form-control ${passwordError ? "is-invalid" : ""}`}
          />
          {passwordError && (
            <div className="invalid-feedback">{passwordError}</div>
          )}
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              LOGIN {loading && <div className="spinner"></div>}
            </button>
          </div>
        </div>
      </form>
      <div className="logincheck">
        <p>
          {loginCheck}
          <Link to="/register" className="register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
