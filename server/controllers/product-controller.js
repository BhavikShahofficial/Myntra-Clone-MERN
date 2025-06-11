const { ImageUploadUtils } = require("../helper/cloudinary");
const Product = require("../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    // console.log("Request File:", req.file); // Debugging log

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Convert file buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;

    console.log("Generated base64 URL:", url.substring(0, 100)); // Log first 100 characters

    // Upload to Cloudinary
    const result = await ImageUploadUtils(url);

    // console.log("Cloudinary response:", result);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

//Add new products
const addProduct = async (req, res) => {
  try {
    // console.log("Received request body:", req.body);
    const {
      image,
      title,
      brand,
      description,
      category,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const userId = req.user.id;
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }
    if (!title || !category || !price || !totalStock) {
      return res.status(400).json({
        success: false,
        message: "Title, category, price, and total stock are required",
      });
    }
    const newProduct = new Product({
      image,
      title,
      brand,
      description,
      category,
      price,
      salePrice,
      totalStock,
      owner: userId,
    });
    await newProduct.save();
    res.status(200).json({
      success: true,
      data: newProduct,
      message: "Product Added Successfully",
    });
  } catch (error) {
    console.error("Error Occurred:", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

//fetch
const fetchProduct = async (req, res) => {
  try {
    const listOfProducts = await Product.find({}).populate(
      "owner",
      "userName email"
    );
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.error("Error Occurred:", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

//Delete
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error("Error Occurred:", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

//Edit
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      brand,
      description,
      category,
      price,
      salePrice,
      totalStock,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    await findProduct.save();
    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    console.error("Error Occurred:", error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

const fetchProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "owner",
      "userName"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ data: product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchProduct,
  deleteProduct,
  editProduct,
  fetchProductById,
};
