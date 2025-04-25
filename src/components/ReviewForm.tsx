import React, { useState } from "react";

interface ReviewFormProps {
  listingId: string;
  userId: string;
  onReviewAdded?: () => void;
}

export default function ReviewForm({
  listingId,
  userId,
  onReviewAdded,
}: ReviewFormProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId, userId, comment, rating }),
      });

      if (!res.ok) {
        alert("Please login to add review!");
      }

      setComment("");
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-6 space-y-4 border-t-1 border-gray-400"
    >
      <p className="text-lg font-bold mt-2">Submit a Review</p>
      <div>
        <p className="mr-2 font-semibold mb-2">Rating:</p>
        <div className="starability-slot">
          <input
            type="radio"
            id="rate1"
            name="rating"
            value="1"
            checked={rating === 1}
            onChange={() => setRating(1)}
          />
          <label htmlFor="rate1" title="Amazing">
            1 stars
          </label>

          <input
            type="radio"
            id="rate2"
            name="rating"
            value="2"
            checked={rating === 2}
            onChange={() => setRating(2)}
          />
          <label htmlFor="rate2" title="Very good">
            2 stars
          </label>

          <input
            type="radio"
            id="rate3"
            name="rating"
            value="3"
            checked={rating === 3}
            onChange={() => setRating(3)}
          />
          <label htmlFor="rate3" title="Average">
            3 stars
          </label>

          <input
            type="radio"
            id="rate4"
            name="rating"
            value="4"
            checked={rating === 4}
            onChange={() => setRating(4)}
          />
          <label htmlFor="rate4" title="Not good">
            4 stars
          </label>

          <input
            type="radio"
            id="rate5"
            name="rating"
            value="5"
            checked={rating === 5}
            onChange={() => setRating(5)}
          />
          <label htmlFor="rate5" title="Terrible">
            5 star
          </label>
        </div>
      </div>

      <textarea
        className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-300 resize-none"
        placeholder="Write your review here..."
        value={comment}
        rows={4}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-white font-semibold border border-gray-500 px-4 py-2 rounded hover:bg-black hover:text-white transition-colors duration-300"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
