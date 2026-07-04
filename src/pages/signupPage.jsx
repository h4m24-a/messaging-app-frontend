import { useState } from "react"
import { Link, useNavigate } from "react-router";
import {ChatBubbleLeftEllipsisIcon} from "@heroicons/react/24/outline"

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({})


  const navigate = useNavigate(); // navigate to login page after signing up

 

  const HandleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);




    try {
      const response =  await fetch("messaging-app-backend-production-b49f.up.railway.app/api/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
      })


      const data = await response.json(); //  converts response into a JavaScript object using .json() method.

      // If username exists
      if (response.status === 409) {
        setError(data.error);
        setSuccess("");
        setValidationError("")
        return
      };



      // Validation errors 
      if (response.status === 400) {

        const errObj = {}   // Initializes an empty object  

        // convert errors into an object
        data.errors.forEach(err => {      // iterate over each error
          errObj[err.path] = err.msg    // eg: errObj["username"] = "Username is required";       // path and key is Username or password.
        })                                                                                         // msg is the error message from backend
                                                                    // Maps each error to the corresponding field (e.g., username, password)

        setValidationError(errObj)    // store error in validation state
        setSuccess("")
        setError("")
        return
      }

     

      // If successfull
      if (response.status === 201) {
        setSuccess(data.message);
        setError("");
        setValidationError("")
        navigate('/api/auth/log-in')  // navigate to log in page after signing up
      }



    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
    finally {
      setLoading(false)
    };

    
  }
  
  
  
  if (loading)  {
     <div>Submitting data</div>
  }
  
  
  return (
  <>
  <div className="auth-page">
    <div className="auth-card">
      <ChatBubbleLeftEllipsisIcon className="h-16 w-16 mx-auto text-blue-500" />

      <h1>Create Account</h1>

      <p className="auth-subtitle">
        Join and messaging others!
      </p>

      <form onSubmit={HandleSignUp} className="auth-form">
        <div>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            name="username"
            placeholder="Choose a username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {validationError.username && (
            <p className="auth-error">
              {validationError.username}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            placeholder="Create a password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {validationError.password && (
            <p className="auth-error">
              {validationError.password}
            </p>
          )}
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
          Sign Up
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?
          <Link
            to={"/api/auth/log-in"}
            className="auth-link"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  </div>
</>
  );
}

export default SignupPage