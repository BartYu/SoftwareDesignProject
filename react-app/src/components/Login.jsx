import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmission = (event) => {
    event.preventDefault();
    if (!email) {
      setError("Please enter the correct email.");
      return;
    }
    if (!password) {
      setError("Please enter the correct password.");
      return;
    }
    navigate("/profile");
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
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder="Email"
            className={`form-control ${error && !email ? "is-invalid" : ""}`}
          />
          {!email && error && <div className="invalid-feedback">{error}</div>}
          <label htmlFor="name">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            placeholder="Password"
            className={`form-control ${error && !password ? "is-invalid" : ""}`}
          />
          {!password && error && (
            <div className="invalid-feedback">{error}</div>
          )}
          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
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
