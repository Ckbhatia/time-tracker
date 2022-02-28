import React from "react";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
