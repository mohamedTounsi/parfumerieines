import { NextResponse } from "next/server";
import { Readable } from "stream";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";
import connectDB from "@/lib/mongodb";
import Product from "@/models/product";

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

    const requiredFields = [
      "title", "price", "colors", "date", "description", "sizes", "composition", "care",
      "xsmallQuantity", "smallQuantity", "mediumQuantity", "largeQuantity", "xlargeQuantity", "xxlargeQuantity"
    ];

    for (const field of requiredFields) {
      if (!data.fields[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }

    if (!data.files.frontImg || !data.files.backImg) {
      return NextResponse.json({ message: "Both images are required" }, { status: 400 });
    }

    // Upload both images to Cloudinary
    const uploadToCloudinary = async (file) => {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: "productImages",
        resource_type: "image",
        quality: "auto:eco",
      });
      fs.unlinkSync(file.filepath); // clean up temp file
      return result.secure_url;
    };

    const frontImgUrl = await uploadToCloudinary(data.files.frontImg[0]);
    const backImgUrl = await uploadToCloudinary(data.files.backImg[0]);

    const product = await Product.create({
      title: data.fields.title[0],
      price: data.fields.price[0],
      colors: data.fields.colors[0],
      date: data.fields.date[0],
      description: data.fields.description[0],
      sizes: data.fields.sizes[0],
      composition: data.fields.composition[0],
      care: data.fields.care[0],
      xsmallQuantity: data.fields.xsmallQuantity[0],
      smallQuantity: data.fields.smallQuantity[0],
      mediumQuantity: data.fields.mediumQuantity[0],
      largeQuantity: data.fields.largeQuantity[0],
      xlargeQuantity: data.fields.xlargeQuantity[0],
      xxlargeQuantity: data.fields.xxlargeQuantity[0],
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
