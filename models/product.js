import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  ml: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: String, required: true },
  frontImg: { type: String, required: true },
  backImg: { type: String, required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
