import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
import connectDB from '@/lib/mongodb';
import HeroImage from '@/models/hero';

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

// Convert WebStream to Node stream
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

// 📤 Upload Hero Image
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
      folder: 'heroImages',
    });

    let hero = await HeroImage.findOne();
    if (hero) {
      hero.imageUrl = result.secure_url;
      await hero.save();
    } else {
      hero = await HeroImage.create({ imageUrl: result.secure_url });
    }

    fs.unlinkSync(imagePath);
    return NextResponse.json(hero, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// 📥 Fetch Hero Image
export async function GET() {
  await connectDB();
  const hero = await HeroImage.findOne();
  return NextResponse.json(hero || {}, { status: 200 });
}

// 🗑️ Delete Hero Image
export async function DELETE() {
  await connectDB();

  const hero = await HeroImage.findOne();
  if (!hero) return NextResponse.json({ message: 'No hero image' }, { status: 404 });

  await HeroImage.deleteMany({});
  return NextResponse.json({ message: 'Hero image deleted' }, { status: 200 });
}
