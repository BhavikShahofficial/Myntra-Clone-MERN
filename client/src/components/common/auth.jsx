import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children; // Return the protected route components if authenticated
}

export default PrivateRoute;
