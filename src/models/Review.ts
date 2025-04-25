import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  comment: string;
  rating: number;
  createdAt: Date;
  author: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>({
  comment: {
    type: String,
    required: [true, "Comment is required"],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
