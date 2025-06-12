import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import {
  fetchCartItems,
  updateCartQuantity,
  deleteCartItem,
} from "../store/cartSlice";

const CheckoutPage = () => {
  const bag = useSelector((state) => state.cart?.cartItems || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      if (user.id) {
        dispatch(fetchCartItems({ userId: user.id, token }));
      } else {
        console.warn("User ID not found in session user object.");
      }
    } else {
      console.error("User or token missing from sessionStorage.");
    }
  }, [dispatch]);

  const handleQuantityChange = (productId, quantity) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");
    if (!storedUser?.id || !token || quantity < 1) return;

    dispatch(
      updateCartQuantity({ userId: storedUser.id, productId, quantity, token })
    );
  };

  const handleDeleteItem = (productId) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");
    if (!storedUser?.id || !token) return;

    dispatch(deleteCartItem({ userId: storedUser.id, productId, token }));
  };

  const totalMRP = bag.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalSalePrice = bag.reduce(
    (acc, item) =>
      acc +
      (item.salePrice !== undefined ? item.salePrice : item.price) *
        item.quantity,
    0
  );
  const discount = totalMRP - totalSalePrice;
  const totalAmount = totalSalePrice;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Checkout</h2>
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Delivery Address</Card.Title>
              <Card.Text className="text-muted">
                Bhavik Shah <br />
                Ahmedabad 38007 <br />
                Phone: +91 7359081917
              </Card.Text>
              <Button variant="outline-secondary" size="sm">
                Change Address
              </Button>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              {bag.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
              ) : (
                <ListGroup variant="flush">
                  {bag.map((item, idx) => (
                    <ListGroup.Item key={idx}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <div>
                            <strong>{item.title}</strong>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                –
                              </Button>
                              <span>{item.quantity}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="ms-3"
                                onClick={() => handleDeleteItem(item.productId)}
                              >
                                🗑️
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          {item.salePrice && item.salePrice < item.price ? (
                            <>
                              <div>
                                <del className="text-muted">
                                  ₹{item.price * item.quantity}
                                </del>
                              </div>
                              <div className="fw-bold text-success">
                                ₹{item.salePrice * item.quantity}
                              </div>
                            </>
                          ) : (
                            <div className="fw-bold">
                              ₹{item.price * item.quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Price Details</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Total MRP</span>
                  <span>₹{totalMRP}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Discount</span>
                  <span className="text-success">-₹{discount}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between fw-bold border-top pt-2">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </ListGroup.Item>
              </ListGroup>
              <Button variant="danger" className="w-100 mt-3">
                Place Order
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
