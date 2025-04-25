import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("TOKEN_SECRET is not defined in the environment variables");
  }
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: "7d",
  });

  user.token = token;
  await user.save();

  return NextResponse.json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    },
  });
}
