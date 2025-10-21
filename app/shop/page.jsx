// app/shop/page.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopClient from "./ShopClient";

// Server-side fetch function
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store", // Prevents caching if your DB updates often
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

const Shop = async () => {
  const products = await getProducts();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <ShopClient products={products} />
      <Footer />
    </div>
  );
};

export default Shop;
