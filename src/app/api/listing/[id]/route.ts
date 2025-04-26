import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Listing from "@/models/Listing";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get("id"); // ✅ GET id safely

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    console.log("LISTINGID", id);

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
