import { NextResponse } from "next/server";
import { Readable } from "stream";
import formidable from "formidable";
import fs from "fs";
import connectDB from "@/lib/mongodb";
import Product from "@/models/product";
import cloudinary from "cloudinary";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

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

export async function POST(req) {
  try {
    await connectDB();

    const form = formidable({ multiples: true });
    const nodeReq = readableFromWebReadable(req.body);
    nodeReq.headers = Object.fromEntries(req.headers);

    const data = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Required fields for perfume
    const requiredFields = ["title", "price", "ml", "description", "quantity"];

    for (const field of requiredFields) {
      if (!data.fields[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }

    if (!data.files.frontImg || !data.files.backImg) {
      return NextResponse.json({ message: "Both front and back images are required" }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadToCloudinary = async (file) => {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: "perfumeImages",
        resource_type: "image",
        quality: "auto:eco",
      });
      fs.unlinkSync(file.filepath); // remove temp file
      return result.secure_url;
    };

    const frontImgUrl = await uploadToCloudinary(data.files.frontImg[0]);
    const backImgUrl = await uploadToCloudinary(data.files.backImg[0]);

    const product = await Product.create({
      title: data.fields.title[0],
      price: data.fields.price[0],
      ml: data.fields.ml[0],
      description: data.fields.description[0],
      quantity: data.fields.quantity[0],
      frontImg: frontImgUrl,
      backImg: backImgUrl,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error uploading product:", error);
    return NextResponse.json({ message: "Failed to create product", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to get products", error: error.message }, { status: 500 });
  }
}
