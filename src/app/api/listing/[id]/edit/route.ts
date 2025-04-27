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

// Helper: Upload image buffer to Cloudinary
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

    const pathParts = req.nextUrl.pathname.split("/");
    const id = pathParts[pathParts.length - 2];

    if (!id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Authorization
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

    // Find listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.owner.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not the owner of this listing" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image") as File | null;

    let imageUrl = listing.image;

    // If new image uploaded
    if (image && typeof image === "object") {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await uploadImage(buffer, image.type);
      imageUrl = uploadResult.secure_url;
    }

    const updatedData = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      country: formData.get("country"),
      location: formData.get("location"),
      categories: String(formData.get("categories"))
        ?.split(",")
        .map((c) => c.trim()),
      image: imageUrl,
    };

    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedListing) {
      return NextResponse.json(
        { error: "Listing not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.redirect(`${process.env.WEB_URL}/listing/${id}`);
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
