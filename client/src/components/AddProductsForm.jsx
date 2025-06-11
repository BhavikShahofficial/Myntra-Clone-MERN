import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewProducts, editProduct } from "../store/ProductSlice";
import { addProductsFormElements } from "../config";
import ImageUpload from "./image-upload";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AddProductForm = ({ mode = "add", product = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  const { isLoading, error, success } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        image: product.image || "",
        title: product.title || "",
        description: product.description || "",
        category: product.category || "",
        brand: product.brand || "",
        price: product.price || "",
        salePrice: product.salePrice || "",
        totalStock: product.totalStock || "",
      });
      setUploadedImageUrl(product.image || "");
    }
  }, [mode, product]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({ ...prev, image: uploadedImageUrl }));
    }
  }, [uploadedImageUrl]);

  useEffect(() => {
    if (success) {
      navigate("/home");
      setFormData(initialFormData);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "description",
      "category",
      "brand",
      "price",
      "totalStock",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      console.log("User:", user);
      console.log("User ID:", user?.id);
      const payload = { ...formData, owner: user?.id };

      if (mode === "edit") {
        await dispatch(
          editProduct({ id: product._id, formData: payload })
        ).unwrap();
      } else {
        await dispatch(addNewProducts(payload)).unwrap();
      }

      setFormData(initialFormData);
      setUploadedImageUrl("");
      navigate("/home");
    } catch (err) {
      console.error("Submission Error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        {mode === "edit" ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <ImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          loadingImage={loadingImage}
          setLoadingImage={setLoadingImage}
        />

        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            placeholder="Enter Product Title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            placeholder="Describe Product"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Category & Brand */}
        {["category", "brand"].map((fieldName) =>
          addProductsFormElements
            .filter((el) => el.name === fieldName)
            .map((field) => (
              <div className="mb-3" key={field.name}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <select
                  className="form-select"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))
        )}

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            placeholder="Enter Price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* Sale Price */}
        <div className="mb-3">
          <label htmlFor="salePrice" className="form-label">
            Sale Price
          </label>
          <input
            type="number"
            className="form-control"
            id="salePrice"
            name="salePrice"
            placeholder="Enter Sale Price (optional)"
            value={formData.salePrice}
            onChange={handleChange}
          />
        </div>

        {/* Total Stock */}
        <div className="mb-3">
          <label htmlFor="totalStock" className="form-label">
            Total Stock
          </label>
          <input
            type="number"
            className="form-control"
            id="totalStock"
            name="totalStock"
            placeholder="Available?"
            value={formData.totalStock}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary mb-5"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : mode === "edit" ? "Update" : "Submit"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default AddProductForm;
