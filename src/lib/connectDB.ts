import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error("MONGO_URL environment variable is not defined");
}

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "Wanderlust",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
