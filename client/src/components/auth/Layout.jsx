import React from "react";
import { Outlet } from "react-router-dom";
function AuthLayout() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card p-4 shadow-sm">
            <h2 className="text-center mb-4">Authentication</h2>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
