const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");

const app = express();

app.use(express.json());

//connect
mongoose.connect("mongodb://localhost/react-shopping-cart-db", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// ============= Product ===============

//define Schema
const productSchema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  title: String,
  description: String,
  image: String,
  price: Number,
  availableSizes: [String],
});

//compile into model
const Product = mongoose.model("products", productSchema);

//methods

app.get("/api/products", async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.post("/api/products", async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.send(savedProduct);
});

app.delete(
  "/api/products/:id",
  async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.send(deletedProduct);
    next();
  },
  () => {
    console.log("A product has been deleted");
  }
);

// ============= Order ===============

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: shortid.generate },
    email: String,
    name: String,
    address: String,
    total: Number,
    cartItems: [
      {
        _id: String,
        title: String,
        price: Number,
        count: Number,
      },
    ],
  },
  {
    timestamp: true,
  }
);

const Order = mongoose.model("order", orderSchema);

app.post("/api/orders", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.address || !req.body.total || !req.body.cartItems) {
    return res.send({ message: "Data required" });
  }
  const order = await Order(req.body).save();
  res.send(order);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
