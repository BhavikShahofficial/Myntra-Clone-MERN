import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddProductForm from "./AddProductsForm";
import axios from "axios";

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/home/products/get/${id}`
        );
        setProduct(response.data.data); // assumes `{ data: product }`
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return <AddProductForm mode="edit" product={product} />;
};

export default EditProductPage;
