import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./utils/client";
import authClient from "./utils/auth_client";
import { getIsAuthenticated } from "./utils/auth";
import { AuthProvider } from "./Context/AuthContext";
import { getUserInfo } from "./utils/storage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import ErrorFallback from "./components/ErrorFallback";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() =>
    getIsAuthenticated()
  );
  const [hasError, setHasError] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(() =>
    isAuthenticated ? getUserInfo() : null
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      const currentUserInfo = getUserInfo();
      setUserInfo(currentUserInfo);
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated, setUserInfo]);

  const handleError = () => {
    setHasError(true);
  };

  const handleResetError = () => {
    setHasError(false);
  }

  return (
    <Router>
      <ErrorBoundary
        resetKeys={[hasError]}
        onError={handleError}
        resetErrorBoundary={handleResetError}
        isAuthenticated={isAuthenticated}
        FallbackComponent={ErrorFallback}
      >
        <ApolloProvider client={isAuthenticated ? client : authClient}>
          <AuthProvider
            value={{ userInfo, isAuthenticated, setIsAuthenticated }}
          >
            {isAuthenticated ? <ProtectedRoutes /> : <PublicRoutes />}
          </AuthProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
