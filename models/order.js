import mongoose from "mongoose";

const orderedProductSchema = new mongoose.Schema({
  productId: String,
  title: String,
  image: String,
  size: String,
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    shippingMethod: String,
    paymentMethod: String,
    notes: String,
    products: [orderedProductSchema],
    total: Number,
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
