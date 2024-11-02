import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Helmet } from "react-helmet";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailRegrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (event) => {
    event.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else if (!emailRegrex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    }
    if (isValid) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5005/auth/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
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
        // console.log("Role is", role);
        login(role);
        if (role == "admin") {
          navigate("/management");
        } else {
          navigate("/profile");
        }
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
      <Helmet>
        <title>Login Page</title>
      </Helmet>
      <h3> Welcome Back! </h3>
      <form className="addUserForm" onSubmit={handleLogin}>
        <div className="inputGroup">
          <label htmlFor="email">Username</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLowerCase());
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
              {loading ? (
                <>
                  <div className="spinner"></div> Logging in...
                </>
              ) : (
                "LOGIN"
              )}
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
