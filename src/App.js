import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { protectedRoutes, publicRoutes } from "./routes";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./utils/client";
import authClient from "./utils/auth_client"
import { getIsAuthenticated } from "./utils/auth";
import Default from "./components/Default";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => getIsAuthenticated());

  return (
      <Router>
        {isAuthenticated ?
          <ApolloProvider client={client}>
            <Routes>
              {protectedRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={<route.element />} />
                ))}
                <Route path='*' element={<Default setIsAuthenticated={setIsAuthenticated}  />} />
            </Routes>
          </ApolloProvider>
          :
          <ApolloProvider client={authClient}>
            <Routes>
              {publicRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={<route.element />} />
              ))}
                <Route path='*' element={<Default setIsAuthenticated={setIsAuthenticated}  />} />
            </Routes>
          </ApolloProvider>
        }
      </Router>
  );
}

export default App;
