"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const ThankYouPage = () => {
  useEffect(() => {
    // Optional: clear cart/session after order
    sessionStorage.removeItem("checkoutCart");
    sessionStorage.removeItem("checkoutSingleProduct");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 text-center">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        Your order has been successfully placed. We’ll begin preparing your
        package shortly.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all font-medium shadow-md"
        >
          Home
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all font-medium shadow-md"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
