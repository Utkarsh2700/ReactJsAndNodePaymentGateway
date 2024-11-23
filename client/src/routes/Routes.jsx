import React from "react";
import { Outlet } from "react-router";

const Routes = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default Routes;
