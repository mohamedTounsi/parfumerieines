"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    price: "",
    colors: "",
    date: "",
    description: "",
    sizes: "",
    composition: "",
    care: "",
    xsmallQuantity: "",
    smallQuantity: "",
    mediumQuantity: "",
    largeQuantity: "",
    xlargeQuantity: "",
    xxlargeQuantity: "",
  });

  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [existingFront, setExistingFront] = useState("");
  const [existingBack, setExistingBack] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        setForm({
          title: data.title || "",
          price: data.price || "",
          colors: data.colors || "",
          date: data.date?.slice(0, 10) || "",
          description: data.description || "",
          sizes: data.sizes || "",
          composition: data.composition || "",
          care: data.care || "",
          xsmallQuantity: data.xsmallQuantity || "",
          smallQuantity: data.smallQuantity || "",
          mediumQuantity: data.mediumQuantity || "",
          largeQuantity: data.largeQuantity || "",
          xlargeQuantity: data.xlargeQuantity || "",
          xxlargeQuantity: data.xxlargeQuantity || "",
        });

        setExistingFront(data.frontImg);
        setExistingBack(data.backImg);
      } catch (error) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "frontImg") setFrontImg(files[0]);
    if (name === "backImg") setBackImg(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (frontImg) data.append("frontImg", frontImg);
    if (backImg) data.append("backImg", backImg);

    const toastId = toast.loading("Updating product...");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: data,
      });

      if (res.ok) {
        toast.success("Product updated!", { id: toastId });
        router.push("/dashbord/products");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="w-full h-full">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          Edit Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            ["title", "Title", "text"],
            ["price", "Price", "text"],
            ["colors", "Colors", "text"],
            ["date", "Date", "date"],
            ["sizes", "Sizes", "text"],
            ["composition", "Composition", "text"],
            ["care", "Care Instructions", "text"],
            ["xsmallQuantity", "XS Quantity", "number"],
            ["smallQuantity", "S Quantity", "number"],
            ["mediumQuantity", "M Quantity", "number"],
            ["largeQuantity", "L Quantity", "number"],
            ["xlargeQuantity", "XL Quantity", "number"],
            ["xxlargeQuantity", "XXL Quantity", "number"],
          ].map(([name, label, type]) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}

          <div className="md:col-span-2 flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Front Image
            </label>
            {existingFront && !frontImg && (
              <img
                src={existingFront}
                alt="Front"
                className="w-24 h-24 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              name="frontImg"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Back Image
            </label>
            {existingBack && !backImg && (
              <img
                src={existingBack}
                alt="Back"
                className="w-24 h-24 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              name="backImg"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
