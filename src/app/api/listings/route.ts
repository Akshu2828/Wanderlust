import { NextResponse } from "next/server";
import Listing from "@/models/Listing";
import connectDB from "@/lib/connectDB";

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    const filter: any = {};

    if (category) {
      filter.categories = { $in: [category] };
    }

    if (search && search.trim() !== "") {
      try {
        const searchRegex = new RegExp(search, "i");
        filter.$or = [
          { title: searchRegex },
          { location: searchRegex },
          { country: searchRegex },
        ];
      } catch (err) {
        console.error("Invalid regex in search:", err);
        return NextResponse.json(
          { error: "Invalid search input" },
          { status: 400 }
        );
      }
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ listings }, { status: 200 });
  } catch (error) {
    console.error("Fetch listings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
