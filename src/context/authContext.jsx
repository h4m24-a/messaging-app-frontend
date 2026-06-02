import { createContext, useState, useEffect } from "react";

// states: accessToken, isAuthenticated.  functions: login, logout

// Create AuthContext to hold authentication state and actions
const AuthContext = createContext();


// AuthProvider component to provide context value

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState();
  const [userId, setUserId] = useState();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] =  useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {  // lazy initialization using the useState hook.
  return localStorage.getItem("isAuthenticated");   
}); // reads from localStorage right at initialization 



  const login = async (token) => { // function is called when a user logs in successfully
    setAccessToken(token); // saving token in state, to use in future requests
    localStorage.setItem("isAuthenticated", "true");    // The first time user logs in, the isAuthenticated entry is created.
    setIsAuthenticated(true); // marks user as authenticated, triggers ui update to show that user is logged in.
  };
  



  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      // Clear token and localStorage
      setIsAuthenticated(false); // user is now unauthorized after logging out
      setAccessToken(null); // Update & empty token state when user logs out
      localStorage.removeItem("isAuthenticated"); // Clear values from local storage

      
    } catch (error) {
      throw Error("Failed to logout", error)
    }
  }


  // Refresh Token
  
  useEffect(() => {
    if (!isAuthenticated) return;   // If user is not authenticated, return stops the execution of getRefresh

    const getRefresh = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/refresh", {    // making a get request to this route to allow users to request a new access token using a valid refresh token
          credentials: "include",  // ensures that cookies, authorization tokens, or other credentials are sent with the request,
        });

        const data = await response.json();  // parse that JSON string into a JavaScript object.  await ensures that function waits for json parsing before continuing

        if (!response.ok) {
          const error = new Error(data.error || "Failed to refresh token");
          error.status = response.status;
          throw error;
        }

        setAccessToken(data.accessToken);
      } catch (error) {
        console.error("Refresh token failed:", error.message);
        setAccessToken(null);
      }
    };

    getRefresh();
  }, [isAuthenticated]);


  

// User profile - id, username
  useEffect(() => {
    
    if (!isAuthenticated) return;
    if (!accessToken) return;
    
    const getUserProfile = async () => {
      setLoading(true)
      
      try {
        const response = await fetch("http://localhost:3000/api/auth/user", {
          method: 'GET',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        const data = await response.json();
        
        if (response.status === 401) {
          throw new Error(data.message || "You are unauthorized");
        }
        
        if (response.status === 500) {
          throw new Error(data.message || "Failed to fetch user profile");
        }

        
        setUserId(data.id);
        setLoggedInUser(data.username);
        setLoading(false)
        
      } catch (error) {
        setError(error.message);
      }
    
    }
    getUserProfile();
    

  }, [accessToken, isAuthenticated]);












  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, userId, loggedInUser, loading, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};












export default AuthContext;

/* return:

Make accessToken, isAuthenticated, login(), and logout() available to all child components in the tree, so they can use them via the useAuthContext() hook.”

It enables a global authentication state across your app without needing to pass props around manually.


*/
