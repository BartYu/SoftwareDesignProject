import "./Register.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // const [error, setError] = useState("");

  // const handleSubmission = (event) => {
  //   event.preventDefault();
  // };

  const loginCheck = "Already have an account? ";

  return (
    <div className="addUser">
      <h3> Create Account </h3>
      <form className="addUserForm">
        <div className="inputGroup">
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder="Email"
            required
          />
          <label htmlFor="name">Password:</label>
          <div className="password-container">
            <input
              type={visible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              placeholder="Password (6+characters) "
              required
            />
            <i
              className={`bi ${visible ? "bi-eye-fill" : "bi-eye-slash"}`}
              onClick={toggleVisibility}
            ></i>
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
            Sign Up
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
