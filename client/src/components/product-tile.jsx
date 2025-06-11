import React from "react";
import { Col, Card, Button, ButtonGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductTilePage = ({ product, handleDelete, handleAddToCart }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Check if the logged-in user is the owner of the product
  const isOwner = user?.id === product.owner?._id;

  const handleEdit = () => {
    navigate(`/edit-product/${product._id}`);
  };

  return (
    <Col className="mb-4">
      <Card className="h-100 shadow-sm rounded border-0">
        {/* Image */}
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.title}
          style={{ height: "250px", objectFit: "cover" }}
        />

        <Card.Body className="d-flex flex-column">
          {/* Product Title */}
          <Card.Title className="d-flex align-items-center text-truncate">
            <span className="me-2">{product.title}</span>
            <Card.Text
              className="text-truncate mb-0"
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "gray",
              }}
            >
              by {product.owner?.userName || "Unknown Owner"}
            </Card.Text>
          </Card.Title>

          {/* Owner Username styled like title, but smaller */}
          {/* Product Description */}
          <p className="text-muted text-truncate" style={{ maxHeight: "60px" }}>
            {product.description}
          </p>
          {/* Price Section */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="price-container d-flex gap-2 align-items-center">
              {product.salePrice != null ? (
                <>
                  <span className="fw-bold text-danger mb-0">
                    ${Number(product.salePrice).toFixed(2)}
                  </span>
                  <span className="text-muted text-decoration-line-through mb-0">
                    ${Number(product.price || 0).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="fw-bold mb-0">
                  ${Number(product.price || 0).toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating or Other Badge */}
            <div className="rating">{/* Optional: stars */}</div>
          </div>
          {/* Add to Cart Button */}
          <Button
            onClick={() => handleAddToCart(product._id)}
            variant="primary"
            className="mt-auto rounded-3"
          >
            Add to Cart
          </Button>
          {/* Edit/Delete Buttons (only visible if the user is the owner) */}
          {isOwner && (
            <ButtonGroup className="mt-1">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductTilePage;
