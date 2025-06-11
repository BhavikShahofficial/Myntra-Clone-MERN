import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/Notfound";
import Login from "./pages/auth/Login";
import AuthLayout from "./components/auth/Layout";
import Register from "./pages/auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/authSlice";
import ShopLayout from "./components/layout";
import AddProductForm from "./components/AddProductsForm";
import EditProductPage from "./components/EditProductPage";
import PrivateRoute from "./components/common/auth"; // Import the PrivateRoute
import CheckoutPage from "./pages/Checkout";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // if (isLoading) {
  //   return <div>Loading...</div>; // Optionally add a loading state for the first time auth check
  // }

  return (
    <Routes>
      <Route path="/" element={<ShopLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="edit-product/:id" element={<EditProductPage />} />
        <Route
          path="add-product"
          element={
            <PrivateRoute>
              <AddProductForm mode="add" />
            </PrivateRoute>
          }
        />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        {/* Redirect to home if already authenticated */}
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
