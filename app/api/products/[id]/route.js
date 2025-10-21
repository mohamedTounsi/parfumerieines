import mongoose from "mongoose";
import Product from "@/models/product";
import connectDB from "@/lib/mongodb";
import cloudinary from "cloudinary";
import formidable from "formidable";
import { Readable } from "stream";
import fs from "fs";
import fsPromises from "fs/promises";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: { bodyParser: false },
};

// Utility function to convert WebReadableStream to Node.js Readable
function readableFromWebReadable(webReadable) {
  const reader = webReadable.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) return this.push(null);
      this.push(value);
    },
  });
}

// Function to check if ObjectId is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// PUT Route (Update Product)
export async function PUT(req, { params }) {
  try {
    await connectDB();

    if (!isValidObjectId(params.id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const form = formidable({ multiples: true });
    const nodeReq = readableFromWebReadable(req.body);
    nodeReq.headers = Object.fromEntries(req.headers);

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const updatedData = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]])
    );

    // Handle Image Upload (frontImg)
    if (files.frontImg?.[0]?.filepath) {
      const uploaded = await cloudinary.v2.uploader.upload(files.frontImg[0].filepath, {
        folder: "productImages",
        resource_type: "image",
      });
      updatedData.frontImg = uploaded.secure_url;
      await fsPromises.unlink(files.frontImg[0].filepath); // cleanup temp file
    }

    // Handle Image Upload (backImg)
    if (files.backImg?.[0]?.filepath) {
      const uploaded = await cloudinary.v2.uploader.upload(files.backImg[0].filepath, {
        folder: "productImages",
        resource_type: "image",
      });
      updatedData.backImg = uploaded.secure_url;
      await fsPromises.unlink(files.backImg[0].filepath); // cleanup temp file
    }

    // Update Product in Database
    await Product.findByIdAndUpdate(params.id, updatedData);
    return new Response(JSON.stringify({ message: "Product updated" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Update failed" }), {
      status: 500,
    });
  }
}

// GET Route (Fetch Product by ID)
export const GET = async (req) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // get the last part (id)

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch product" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// DELETE Route (Delete Product by ID)
export const DELETE = async (req) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // get the last part (id)

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete product" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
