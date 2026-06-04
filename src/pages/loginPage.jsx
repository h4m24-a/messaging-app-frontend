import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { Link, useNavigate } from "react-router";


const LoginPage = () => {
  // const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const Navigate = useNavigate()

  const { login } = useAuthContext();
  

  

  const HandleLogin = async (e) => {
  e.preventDefault();


    try {
      const response = await fetch("http://localhost:3000/api/auth/log-in", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
      });
      const data = await response.json();

      // if user & password are incorrect, set the error message
      if (response.status === 401) {
        setError(data.message)
        setSuccess("")
        return;
      }

      
      // If successfull
      if (response.status === 200) {
        Navigate('/')
        login(data.accessToken);
        setError("")
        setSuccess(data.message)
      }

      

    
    } catch (error) {
      throw error(error.message)
    }
    finally {
      setIsLoading(false)
    }

    
  };
  
  if (isLoading) (
     <div>Loading Log In form</div>
  )

  return (
    <>
  <div className="auth-page">
    <div className="auth-card">
      <i className="fa-solid fa-message auth-logo"></i>

      <h1>Welcome Back</h1>

      <p className="auth-subtitle">
        Sign in to your account
      </p>

      <form onSubmit={HandleLogin} className="auth-form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        {success && (
          <p className="auth-success">
            {success}
          </p>
        )}

        <button type="submit">
          Log In
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?
          <Link
            to="/api/auth/sign-up"
            className="auth-link"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </div>
</>
  );
};

export default LoginPage;
