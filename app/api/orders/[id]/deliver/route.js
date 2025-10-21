import connectDB from "@/lib/mongodb";
import Order from "@/models/order";

export async function PUT(request, context) {
  const { id } = await context.params; // ✅ Await the params

  await connectDB();

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { isDelivered: true },
      { new: true }
    );

    if (!updatedOrder) {
      return new Response("Order not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update order:", error);
    return new Response("Failed to update order", { status: 500 });
  }
}
