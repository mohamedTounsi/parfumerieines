"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";

const CreateProductPage = () => {
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
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === "frontImg") {
      setFrontImg(file);
      setPreviewFront(URL.createObjectURL(file));
    }
    if (name === "backImg") {
      setBackImg(file);
      setPreviewBack(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (frontImg) data.append("frontImg", frontImg);
    if (backImg) data.append("backImg", backImg);

    const toastId = toast.loading("Submitting product...");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        toast.success("Product added successfully!", { id: toastId });
        router.push("/dashbord/products");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to add product", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="w-full h-full">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          Create Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          encType="multipart/form-data"
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
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="frontImg"
              className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 "
            >
              Front Image <Upload />
            </label>
            {previewFront && (
              <img
                src={previewFront}
                alt="Front Preview"
                className="w-32 h-32 object-cover rounded mb-2 border"
              />
            )}
            <input
              id="frontImg"
              type="file"
              name="frontImg"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm hidden"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="backImg"
              className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              Back Image <Upload />
            </label>
            {previewBack && (
              <img
                src={previewBack}
                alt="Back Preview"
                className="w-32 h-32 object-cover rounded mb-2 border"
              />
            )}
            <input
              id="backImg"
              type="file"
              name="backImg"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm hidden"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition duration-200"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
