import "./login.css";
import { Link } from "react-router-dom";

function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  // const handleSubmission = (event) => {
  //   event.preventDefault();
  // };

  return (
    <div className="addUser">
      <h3> Log In</h3>
      <form className="addUserForm">
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Enter your Email"
            required
          />
          <label htmlFor="name">Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            placeholder="Enter password"
            required
          />
          <button type="submit" class="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      <div className="logincheck">
        <p> Not registered? </p>
        <Link to="/" type="button" class="btn btn-success">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
