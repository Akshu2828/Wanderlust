import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Review from "@/models/Review";
import Listing from "@/models/Listing";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "Please LogIn to post a Review!" },
      { status: 401 }
    );
  }
  try {
    await connectDB();

    const { userId, listingId, comment, rating } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Please LogIn to post a Review!" },
        { status: 400 }
      );
    }

    if (!listingId || !comment || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = await Review.create({
      author: userId,
      comment,
      rating,
    });

    await Listing.findByIdAndUpdate(listingId, {
      $push: { reviews: newReview._id },
    });

    return NextResponse.json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
