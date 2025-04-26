import { NextResponse, NextRequest } from "next/server";
import Listing from "@/models/Listing";
import connectDB from "@/lib/connectDB";
import "@/models/User";
import "@/models/Review";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(id)
      .populate("owner", "name email")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "name email",
        },
      });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
