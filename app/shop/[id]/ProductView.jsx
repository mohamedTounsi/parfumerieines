"use client";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProductView = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState("front");
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    if (quantity < parseInt(product.quantity)) setQuantity((q) => q + 1);
    else toast.error(`Only ${product.quantity} left in stock.`);
  };

  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (parseInt(product.quantity) === 0) {
      toast.error("Product is sold out.");
      return;
    }
    addToCart({
      _id: product._id,
      title: product.title,
      image: product.frontImg,
      price: product.price,
      quantity,
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (parseInt(product.quantity) === 0) {
      toast.error("Product is sold out.");
      return;
    }

    // Save single product to session for checkout
    sessionStorage.setItem(
      "checkoutSingleProduct",
      JSON.stringify({
        _id: product._id,
        title: product.title,
        image: product.frontImg,
        price: product.price,
        quantity,
      })
    );
    router.push("/checkout");
  };

  const isSoldOut = parseInt(product.quantity) === 0;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Images */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-4">
              <div className="relative w-full overflow-hidden mb-4">
                <img
                  src={
                    activeImage === "front" ? product.frontImg : product.backImg
                  }
                  alt={product.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveImage("front")}
                  className={`w-20 h-20 border ${
                    activeImage === "front"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={product.frontImg}
                    alt="Front"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </button>
                <button
                  onClick={() => setActiveImage("back")}
                  className={`w-20 h-20 border ${
                    activeImage === "back"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={product.backImg}
                    alt="Back"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-2xl text-gray-900 mb-6 underline">
              {product.price} DT
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-zinc-800 mb-2">
                Quantity
              </h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-lg font-light text-zinc-800 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x text-zinc-800 border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-lg text-zinc-800 font-light cursor-pointer"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {product.quantity} left in stock
              </p>
            </div>

            {/* Actions */}
            {isSoldOut ? (
              <button
                className="w-full py-4 px-6 rounded-md bg-neutral-900 text-white cursor-not-allowed"
                disabled
              >
                Sold Out
              </button>
            ) : (
              <>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 mb-2 cursor-pointer rounded-md border border-neutral-900 text-neutral-900 hover:bg-white transition-all duration-300 ease-in-out"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full cursor-pointer py-4 px-6 rounded-md bg-neutral-900 text-white hover:bg-white hover:text-neutral-900 border border-neutral-900 transition-all duration-180 ease-in-out"
                >
                  Add to Cart
                </button>
              </>
            )}

            {/* Details */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <p className="text-sm text-gray-700 mt-2">
                <strong>Volume:</strong> {product.ml} ml
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
