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
    ml: "",
    description: "",
    quantity: "",
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
        router.push("/dashboard/products");
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
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          Create Perfume
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
          encType="multipart/form-data"
        >
          {[
            ["title", "Title", "text"],
            ["price", "Price", "number"],
            ["ml", "Volume (ml)", "number"],
            ["quantity", "Quantity", "number"],
          ].map(([name, label, type]) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                name={name}
                type={type}
                onChange={handleChange}
                className="p-2 border border-gray-300 text-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              className="p-3 border border-gray-300 text-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
              required
            />
          </div>

          {["frontImg", "backImg"].map((name) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                {name === "frontImg" ? "Front Image" : "Back Image"}
              </label>

              {/* Upload card */}
              <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-black transition relative">
                {(name === "frontImg" ? previewFront : previewBack) ? (
                  <img
                    src={name === "frontImg" ? previewFront : previewBack}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Upload size={32} className="mb-2" />
                    <span className="text-sm">Click to upload</span>
                  </div>
                )}
                <input
                  type="file"
                  name={name}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </label>
            </div>
          ))}

          <div className="flex justify-center mt-4">
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
