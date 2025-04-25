import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  token: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  token: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
