import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered", user: newUser });
  } catch (err) {
    console.log("Registration Error", err);
    return NextResponse.json({ error: "Something went wrong" });
  }
}
