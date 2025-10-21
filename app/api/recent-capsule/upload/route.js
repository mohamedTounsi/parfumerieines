import { NextResponse } from "next/server";
import { Readable } from "stream";
import formidable from "formidable";
import fs from "fs";
import cloudinary from "cloudinary";
import connectDB from "@/lib/mongodb";
import RecentCapsule from "@/models/recentCapsule";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
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

    const form = formidable({
      multiples: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        return mimetype?.includes("image") || false;
      },
    });

    const nodeReq = readableFromWebReadable(req.body);
    nodeReq.headers = Object.fromEntries(req.headers);

    const data = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Validate input
    if (!data.files?.image || !data.fields?.title) {
      return NextResponse.json(
        { error: "Image and title are required" },
        { status: 400 }
      );
    }

    const file = data.files.image[0];
    const imagePath = file.filepath;
    const title = data.fields.title[0];

    // Validate title length
    if (title.length > 100) {
      fs.unlinkSync(imagePath); // Clean up temp file
      return NextResponse.json(
        { error: "Title must be less than 100 characters" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "recentCapsuleImages",
      resource_type: "image",
      quality: "auto:good", // Optimize image quality
    });

    // Create database entry
    const newEntry = await RecentCapsule.create({
      imageUrl: result.secure_url,
      publicId: result.public_id, // Store public_id for future deletion
      title,
    });

    // Clean up temp file
    fs.unlinkSync(imagePath);

    return NextResponse.json({
      _id: newEntry._id,
      title: newEntry.title,
      imageUrl: newEntry.imageUrl,
      publicId: newEntry.publicId,
    }, { status: 201 });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
    try {
      await connectDB();
      const capsules = await RecentCapsule.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(capsules, { status: 200 });
    } catch (err) {
      console.error("Fetch error:", err);
      return NextResponse.json(
        { error: "Failed to fetch capsules" },
        { status: 500 }
      );
    }
  }
  

export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    // Find the capsule first to get Cloudinary public_id
    const capsule = await RecentCapsule.findById(id);
    if (!capsule) {
      return NextResponse.json(
        { error: "Capsule not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary first
    if (capsule.publicId) {
      await cloudinary.v2.uploader.destroy(capsule.publicId);
    }

    // Then delete from database
    await RecentCapsule.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Capsule image deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete capsule" },
      { status: 500 }
    );
  }
}