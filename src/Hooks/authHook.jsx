import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../constants/routes";
import { getIsAuthenticated } from "../utils/auth";

const useAuthHook = () => {
  const navigate = useNavigate();
  const isAuthenticated = getIsAuthenticated();

  React.useEffect(() => {
    if(isAuthenticated) {
      navigate(routes.tracker)
    } else {
      navigate(routes.login)
    }
  }, [navigate, isAuthenticated]);

  return isAuthenticated;
};

export default useAuthHook;