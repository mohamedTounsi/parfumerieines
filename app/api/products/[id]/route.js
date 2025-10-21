import mongoose from "mongoose";
import Product from "@/models/product";
import connectDB from "@/lib/mongodb";
import cloudinary from "cloudinary";
import formidable from "formidable";
import { Readable } from "stream";
import fs from "fs";
import fsPromises from "fs/promises";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = { api: { bodyParser: false } };

// Convert WebReadableStream to Node.js Readable
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

// Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// PUT Route - Update Product
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

    // Upload frontImg if present
    if (files.frontImg?.[0]?.filepath) {
      const uploaded = await cloudinary.v2.uploader.upload(files.frontImg[0].filepath, {
        folder: "perfumeImages",
        resource_type: "image",
      });
      updatedData.frontImg = uploaded.secure_url;
      await fsPromises.unlink(files.frontImg[0].filepath);
    }

    // Upload backImg if present
    if (files.backImg?.[0]?.filepath) {
      const uploaded = await cloudinary.v2.uploader.upload(files.backImg[0].filepath, {
        folder: "perfumeImages",
        resource_type: "image",
      });
      updatedData.backImg = uploaded.secure_url;
      await fsPromises.unlink(files.backImg[0].filepath);
    }

    await Product.findByIdAndUpdate(params.id, updatedData, { new: true });
    return new Response(JSON.stringify({ message: "Product updated successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Update failed", error: err.message }), { status: 500 });
  }
}

// GET Route - Fetch Product by ID
export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(product), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to fetch product", error: err.message }), { status: 500 });
  }
}

// DELETE Route - Delete Product by ID
export async function DELETE(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ message: "Product deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to delete product", error: err.message }), { status: 500 });
  }
};
