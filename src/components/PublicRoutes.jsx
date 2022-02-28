import React from "react";
import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "../routes";
import Default from "./Default";

const PublicRoutes = () => {
  return (
    <Routes>
      {publicRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={<route.element />} />
      ))}
      <Route path="*" element={<Default />} />
    </Routes>
  );
};

export default PublicRoutes;
