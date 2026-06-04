import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./pages/homepage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import SignupPage from "./pages/signupPage"
import Error from "./pages/errorPage";
import { useAuthContext } from "./context/useAuthContext"


const queryClient = new QueryClient();

function App() {
  
  
  const { isAuthenticated, loading } = useAuthContext();
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (    // authenticated
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="*" element={<Error />} />
          </>


        ) : (   // not authenticated
          <>
            <Route path="/api/auth/log-in" element={<LoginPage />} />
            <Route path="/api/auth/sign-up" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/api/auth/log-in" />}/> {" "} {/*Redirect all other paths to log-in if not authenticated */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
}

export default App
