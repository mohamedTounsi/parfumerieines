// ✅ Fixed backend route: app/api/shop-now/upload/route.js
import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
import connectDB from '@/lib/mongodb';
import ShopNowImage from '@/models/shopNowImage';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  await connectDB();

  const form = formidable({ multiples: false });
  const nodeReq = readableFromWebReadable(req.body);
  nodeReq.headers = Object.fromEntries(req.headers);

  const data = await new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files.image[0];
  const imagePath = file.filepath;

  try {
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: 'shopNowImages',
    });

    let shopNow = await ShopNowImage.findOne();
    if (shopNow) {
      shopNow.imageUrl = result.secure_url;
      await shopNow.save();
    } else {
      shopNow = await ShopNowImage.create({ imageUrl: result.secure_url });
    }

    fs.unlinkSync(imagePath);
    return NextResponse.json({ imageUrl: shopNow.imageUrl }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const shopNow = await ShopNowImage.findOne();
  return NextResponse.json({ imageUrl: shopNow?.imageUrl || null }, { status: 200 });
}

export async function DELETE() {
  await connectDB();
  const shopNow = await ShopNowImage.findOne();
  if (!shopNow) return NextResponse.json({ message: 'No image found' }, { status: 404 });

  await ShopNowImage.deleteMany({});
  return NextResponse.json({ message: 'Image deleted successfully!' }, { status: 200 });
}
