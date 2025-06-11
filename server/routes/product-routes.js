const express = require("express");
const { authMiddleware } = require("../controllers/auth/auth-controller");
const {
  handleImageUpload,
  addProduct,
  fetchProduct,
  editProduct,
  deleteProduct,
  fetchProductById,
} = require("../controllers/product-controller");
const router = express.Router();
const { upload } = require("../helper/cloudinary");

router.post("/image-upload", upload.single("my_file"), handleImageUpload);
router.get("/get", fetchProduct);
router.post("/add", authMiddleware, addProduct);
router.put("/edit/:id", authMiddleware, editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get/:id", fetchProductById);

module.exports = router;
