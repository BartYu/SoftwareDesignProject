import "./Signup.css";
import { Link } from "react-router-dom";

function Signup() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  // const handleSubmission = (event) => {
  //   event.preventDefault();
  // };

  return (
    <div className="addUser">
      <h3> Sign Up</h3>
      <form className="addUserForm">
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            placeholder="Enter your name"
            required
          />
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
          <button type="Submit" class="btn btn-success">
            Sign Up
          </button>
        </div>
      </form>
      <div className="logincheck">
        <p> Already have an account? </p>
        <Link to="./login" type="button" class="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
