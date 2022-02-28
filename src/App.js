import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./utils/client";
import authClient from "./utils/auth_client";
import { getIsAuthenticated } from "./utils/auth";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() =>
    getIsAuthenticated()
  );

  return (
    <Router>
      <ApolloProvider client={isAuthenticated ? client : authClient}>
        <AuthProvider value={{ isAuthenticated, setIsAuthenticated }}>
          {isAuthenticated ? <ProtectedRoutes /> : <PublicRoutes />}
        </AuthProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;
