import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  price: String,
  frontImg: String,
  backImg: String,
  colors: [String],
  date: String,
  description: String,
  sizes: [String],
  composition: String,
  care: String,
  xsmallQuantity: String,
  smallQuantity: String,
  mediumQuantity: String,
  largeQuantity: String,
  xlargeQuantity: String,
  xxlargeQuantity: String,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
