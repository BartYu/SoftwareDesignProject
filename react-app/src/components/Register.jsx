import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const handleSubmission = async (event) => {
    event.preventDefault();
    let hasError = false;

    if (!email) {
      setEmailError("Please enter your email.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Please enter a password.");
      hasError = true;
    }
    if (!role) {
      setRoleError("Please select your role.");
      hasError = true;
    }
    if (!hasError) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role }),
        });
        if (!response.ok) {
          const responseData = await response.json();
          setEmailError(responseData.msg);
          setLoading(false);
          return;
        }
        navigate("/");
      } catch (err) {
        setEmailError("An error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  const loginCheck = "Already have an account? ";

  return (
    <div className="addUser">
      <h3> Create Account </h3>
      <form className="addUserForm" onSubmit={handleSubmission}>
        <div className="inputGroup">
          <label htmlFor="email">Email address</label>
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
          <div className="password-container">
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
          </div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (e.target.value) setRoleError("");
            }}
            className={`form-control ${roleError ? "is-invalid" : ""}`}
          >
            <option selected disabled value="">
              --Select--
            </option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
          </select>
          {roleError && <div className="invalid-feedback">{roleError}</div>}
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              SIGN UP {loading && <div className="spinner"></div>}
            </button>
          </div>
        </div>
      </form>
      <div className="logincheck">
        <p>
          {loginCheck}
          <Link to="/" className="login-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
