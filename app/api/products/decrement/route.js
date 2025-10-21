import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";

export async function POST(req) {
  try {
    await dbConnect();
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return new Response(JSON.stringify({ message: "Missing data" }), {
        status: 400,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    const newQuantity = parseInt(product.quantity) - parseInt(quantity);
    if (newQuantity < 0) {
      return new Response(JSON.stringify({ message: "Not enough stock" }), {
        status: 400,
      });
    }

    product.quantity = newQuantity.toString();
    await product.save();

    return new Response(JSON.stringify({ success: true, quantity: product.quantity }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
