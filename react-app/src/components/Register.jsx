import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmission = (event) => {
    event.preventDefault();
    let hasError = false;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Please enter your email.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Please enter a password.");
      hasError = true;
    }
    if (!hasError) {
      navigate("/");
    }
  };

  const loginCheck = "Already have an account? ";

  return (
    <div className="addUser">
      <h3> Create Account </h3>
      <form className="addUserForm" onSubmit={handleSubmission}>
        <div className="inputGroup">
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder="Email"
            className={`form-control ${emailError ? "is-invalid" : ""}`}
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
          <label htmlFor="name">Password:</label>
          <div className="password-container">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              placeholder="Password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
            />
            {passwordError && (
              <div className="invalid-feedback">{passwordError}</div>
            )}
          </div>
          <label htmlFor="role">Select User Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option selected disabled value="">
              --Select--
            </option>
            <option value="Admin">Admin</option>
            <option value="Volunteer">Volunteer</option>
          </select>
          <button type="Submit" className="btn btn-success">
            SIGN UP
          </button>
        </div>
      </form>
      <div className="logincheck">
        <p>
          {loginCheck}
          <Link to="./login" className="login-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
