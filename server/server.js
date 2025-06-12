require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth-routes");
const productsRouter = require("./routes/product-routes");
const cartRouter = require("./routes/cart-routes");

const PORT = process.env.PORT;

const app = express();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongodb Connected"))
  .catch((error) => console.log(error));

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/home/products", productsRouter);
app.use("/api/shop/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
