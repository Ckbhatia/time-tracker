import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./utils/client";
import authClient from "./utils/auth_client";
import { getIsAuthenticated } from "./utils/auth";
import { AuthProvider } from "./Context/AuthContext";
import { getUserInfo } from "./utils/storage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() =>
    getIsAuthenticated()
  );
  const [userInfo, setUserInfo] = React.useState(async() => isAuthenticated ? await getUserInfo() : null);

  React.useEffect(() => {
    if(isAuthenticated) {
      (async() => {
        const userInfo = await getUserInfo()
        setUserInfo(userInfo);
      })()
    }
  }, [isAuthenticated, setUserInfo]);

  return (
    <Router>
      <ApolloProvider client={isAuthenticated ? client : authClient}>
        <AuthProvider value={{ userInfo, isAuthenticated, setIsAuthenticated }}>
          {isAuthenticated ? <ProtectedRoutes /> : <PublicRoutes />}
        </AuthProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;
