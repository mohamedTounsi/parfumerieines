"use client";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProductView = ({ product }) => {
  const { addToCart, clearCart } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState("front");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => {
    const max = getAvailableStock();
    if (quantity < max) {
      setQuantity((q) => q + 1);
    } else {
      toast.error(
        `Only ${max} item${
          max > 1 ? "s" : ""
        } left in stock for size ${selectedSize}.`
      );
    }
  };

  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const getAvailableStock = () => {
    switch (selectedSize) {
      case "XS":
        return parseInt(product.xsmallQuantity);
      case "S":
        return parseInt(product.smallQuantity);
      case "M":
        return parseInt(product.mediumQuantity);
      case "L":
        return parseInt(product.largeQuantity);
      case "XL":
        return parseInt(product.xlargeQuantity);
      case "XXL":
        return parseInt(product.xxlargeQuantity);
      default:
        return 0;
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size to proceed.");
      return;
    }

    // Clear any existing cart items

    const productToBuy = {
      _id: product._id,
      title: product.title,
      image: product.frontImg,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    };

    // Store only this single product
    sessionStorage.setItem(
      "checkoutSingleProduct",
      JSON.stringify(productToBuy)
    );
    router.push("/checkout");
  };

  const isSoldOut =
    product.xsmallQuantity === "0" &&
    product.smallQuantity === "0" &&
    product.mediumQuantity === "0" &&
    product.largeQuantity === "0" &&
    product.xlargeQuantity === "0" &&
    product.xxlargeQuantity === "0";

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
              {product.price}
            </p>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Colors Used{" "}
              </h3>
              <div className="flex gap-2">
                {product.colors[0].split(",").map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <button className="text-xs underline text-gray-500">
                  Size guide
                </button>
              </div>
              <ul className="flex gap-4 flex-wrap">
                {[
                  { label: "XS", quantity: product.xsmallQuantity },
                  { label: "S", quantity: product.smallQuantity },
                  { label: "M", quantity: product.mediumQuantity },
                  { label: "L", quantity: product.largeQuantity },
                  { label: "XL", quantity: product.xlargeQuantity },
                  { label: "XXL", quantity: product.xxlargeQuantity },
                ].map(({ label, quantity }) => {
                  const isDisabled = quantity === "0";
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => !isDisabled && setSelectedSize(label)}
                        disabled={isDisabled}
                        className={`px-5 py-1 cursor-pointer text-lg font-light border rounded-xl transition ${
                          isDisabled
                            ? "bg-gray-200 border-none line-through cursor-not-allowed"
                            : selectedSize === label
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-transparent text-neutral-900 border-neutral-900 hover:bg-neutral-100"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Quantity
              </h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-lg font-light cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-lg font-light cursor-pointer "
                >
                  +
                </button>
              </div>
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
                  onClick={() => {
                    if (!selectedSize) {
                      toast.error("Please select a size to add to cart.");
                      return;
                    }
                    addToCart({
                      _id: product._id,
                      title: product.title,
                      image: product.frontImg,
                      price: product.price,
                      size: selectedSize,
                      color: selectedColor,
                      quantity,
                    });
                    toast.success("Added to cart!");
                  }}
                  className="w-full cursor-pointer py-4 px-6 rounded-md bg-neutral-900 text-white hover:bg-white hover:text-neutral-900 border border-neutral-900 transition-all duration-180 ease-in-out"
                >
                  Add to Cart
                </button>
              </>
            )}

            {/* Details */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Details
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Composition:</strong> {product.composition}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Care instructions:</strong> {product.care}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
