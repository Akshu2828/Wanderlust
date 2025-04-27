import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Listing from "@/models/Listing";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "@/utils/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(
  buffer: Buffer,
  fileType: string
): Promise<{ secure_url: string }> {
  const base64String = buffer.toString("base64");
  const dataUri = `data:${fileType};base64,${base64String}`;

  return await cloudinary.uploader.upload(dataUri, {
    folder: "wanderlust",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
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

    // Parse FormData
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const location = formData.get("location") as string;
    const country = formData.get("country") as string;
    const categories = formData.getAll("categories");
    const coordinates = JSON.parse(formData.get("coordinates") as string);
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Upload Image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadImage(buffer, file.type);

    // Create Listing
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
      message: "Listing created successfully!",
      listing: newListing,
    });
  } catch (error) {
    console.error("Create Listing Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
