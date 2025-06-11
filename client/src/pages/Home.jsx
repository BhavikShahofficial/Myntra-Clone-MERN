import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchAllProducts } from "../store/ProductSlice";
import ProductTilePage from "../components/product-tile";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";

const Home = () => {
  const [currentEditId, setCurrentEditId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, isLoading, error } = useSelector(
    (state) => state.products
  );
  const user = useSelector((state) => state.auth.user); // Assuming user is stored in auth slice

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  function handleDelete(productId) {
    console.log(productId);
    dispatch(deleteProduct(productId)).then((data) => {
      if (data.payload.success) {
        toast.success("Successfully Deleted!");
        dispatch(fetchAllProducts());
      }
    });
  }

  const handleAddToCart = async (productId) => {
    try {
      const userId = user?.id;

      if (!userId) {
        toast.error("Please login to add items to cart");
        return;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/cart/add`, {
        userId,
        productId,
        quantity: 1,
      });

      toast.success("Added to cart!");
      navigate("/checkout");
    } catch (error) {
      console.error("Add to cart failed", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end m-3">
        <Link to="/add-product">
          <Button variant="primary">Add New Product</Button>
        </Link>
      </div>

      <Row className="m-3 g-3">
        {productList && productList.length > 0 ? (
          productList.map((productItem) => (
            <Col key={productItem._id} xs={12} sm={6} md={4} lg={3}>
              <ProductTilePage
                product={productItem}
                setCurrentEditId={setCurrentEditId}
                handleDelete={handleDelete}
                handleAddToCart={handleAddToCart}
                user={user}
              />
            </Col>
          ))
        ) : (
          <div>No products available.</div>
        )}
      </Row>
    </div>
  );
};

export default Home;
