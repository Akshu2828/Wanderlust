import { NextRequest } from "next/server";
import connectDB from "@/lib/connectDB";
import Listing from "@/models/Listing";
import "@/models/User";
import "@/models/Review";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Listing ID is required" }), {
        status: 400,
      });
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
      return new Response(JSON.stringify({ error: "Listing not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ listing }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
