import React from "react";
import { AuthContext } from "../Context/AuthContext";
import useAuthHook from "../Hooks/authHook";

const Default = () => {
  const { setIsAuthenticated } = React.useContext(AuthContext);
  const auth = useAuthHook();

  React.useEffect(() => {
    setIsAuthenticated(auth);
  }, [auth, setIsAuthenticated]);
  
  return <div>...Loading</div>
};

export default Default;