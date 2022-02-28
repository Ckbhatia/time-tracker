import React from "react";
import useAuthHook from "../Hooks/authHook";

const Default = ({ setIsAuthenticated }) => {
  const auth = useAuthHook();

  React.useEffect(() => {
    setIsAuthenticated(auth);
  }, [auth, setIsAuthenticated]);
  
  return <div>...Loading</div>
};

export default Default;