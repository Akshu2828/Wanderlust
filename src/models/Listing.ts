import mongoose, { Document, Schema } from "mongoose";
import { categoryValues } from "@/utils/categories";

export interface IListing extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  location: string;
  country: string;
  categories: string[];
  owner: mongoose.Types.ObjectId;
  reviews: mongoose.Types.ObjectId[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

const ListingSchema = new Schema<IListing>({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
  },
  categories: {
    type: [String],
    required: [true, "Categories are required"],
    enum: categoryValues,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
});

const Listing =
  mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);
export default Listing;
