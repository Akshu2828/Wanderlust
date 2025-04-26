import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Review from "@/models/Review";
import { verifyToken } from "@/utils/auth";

export async function DELETE(req: NextRequest) {
  await connectDB();
  const pathParts = req.nextUrl.pathname.split("/");
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    return NextResponse.json(
      { error: "Review ID is required" },
      { status: 400 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    if (
      typeof decoded !== "object" ||
      !decoded ||
      !("id" in decoded) ||
      review.author.toString() !== decoded.id
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete Review Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
