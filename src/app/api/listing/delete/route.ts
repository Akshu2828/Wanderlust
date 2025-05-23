import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Listing from "@/models/Listing";
import { verifyToken } from "@/utils/auth";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id");
    console.log("DELETEID", id);

    if (!id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

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

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (listing.owner.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not the Owner of this Listing" },
        { status: 403 }
      );
    }

    await Listing.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
