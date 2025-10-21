// app/shop/[id]/page.jsx

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductView from "./ProductView";

const getProduct = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch product");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const ProductPage = async ({ params }) => {
  const { id } = params; // ✅ Extracting params correctly
  const product = await getProduct(id);

  if (!product) {
    return <div className="p-8">Product not found</div>;
  }

  return (
    <div>
      <Header />
      <ProductView product={product} />
      <Footer />
    </div>
  );
};

export default ProductPage;
