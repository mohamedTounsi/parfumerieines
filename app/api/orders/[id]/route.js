// /app/api/order/[id]/route.js

import connectDB from "@/lib/mongodb";
import Order from "@/models/order";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectDB();

    const result = await Order.findByIdAndDelete(id);

    if (!result) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Order deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting order:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
