import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, BrowserRouter, Routes, Route } from "react-router";
import Layout from "./pages/layout";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import SignupPage from "./pages/signupPage"
import Error from "./pages/errorPage";
import { useAuthContext } from "./context/useAuthContext"
import ChatWindow from "./components/chatWindow";
import { useState, useEffect } from "react";
import CreateConversationPage from "./pages/createConversationPage";


const queryClient = new QueryClient();

function App() {


function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);    // Browser listening for a resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
  const width = useWindowWidth();
  const isMobile = width <= 768;
  
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

          {isMobile && (
            <>
             <Route path="/" element={<Layout />} />
             <Route path="/conversations/:id" element={<ChatWindow />} />
            </>
          )}
          
            <Route path="/" element={<Layout />}>
             <Route path="/conversations/:id" element={<ChatWindow />} />
            </Route>
            <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreateConversationPage />} />

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

