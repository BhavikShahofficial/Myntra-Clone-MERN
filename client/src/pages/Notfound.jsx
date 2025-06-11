import React from "react";

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <a href="/home" className="btn btn-primary">
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
