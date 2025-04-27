import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Listing from "@/models/Listing";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { verifyToken } from "@/utils/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function bufferToStream(buffer: Buffer) {
  return new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
}

async function uploadImage(buffer: Buffer): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "wanderlust",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error("Cloudinary upload failed"));
        } else {
          resolve(result as { secure_url: string });
        }
      }
    );
    bufferToStream(buffer).pipe(stream);
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.TOKEN_SECRET;

    if (!secret) throw new Error("TOKEN_SECRET is not defined");

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      console.error("JWT Verify Error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    const formData = await req.formData();
    console.log("Got formData:", formData);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const location = formData.get("location") as string;
    const country = formData.get("country") as string;
    const categories = formData.getAll("categories");

    const file = formData.get("image") as File;
    console.log("Got file:", file);

    const coordinates = JSON.parse(formData.get("coordinates") as string);

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("Connecting to Cloudinary...");
    console.log("Cloudinary config check:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await uploadImage(buffer);
    console.log("Uploaded image:", uploadResult);

    const newListing = new Listing({
      title,
      description,
      image: uploadResult.secure_url,
      price,
      location,
      country,
      categories,
      coordinates,
      owner: userId,
    });

    await newListing.save();

    return NextResponse.json({
      message: "Listing created!",
      listing: newListing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
