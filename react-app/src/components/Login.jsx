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
    // if (password.length < 6) {
    //   setError("Password must be at least 6 characters.");
    // }
    navigate("/profile");
  };
  const loginCheck = "Not registered yet? ";

  return (
    <div className="addUser">
      <h3> Log In</h3>
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
            //required
          />
          <label htmlFor="name">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            placeholder="Password"
            //required
          />
          <button type="submit" class="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      <div className="logincheck">
        <p>
          {loginCheck}
          <Link to="/" class="register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
