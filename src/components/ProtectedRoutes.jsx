import React from "react";
import { Route, Routes } from "react-router-dom";
import { protectedRoutes } from "../routes";
import Default from "./Default";

const ProtectedRoutes = () => {
  return (
    <Routes>
      {protectedRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={<route.element />} />
      ))}
      <Route path="*" element={<Default />} />
    </Routes>
  );
};

export default ProtectedRoutes;
