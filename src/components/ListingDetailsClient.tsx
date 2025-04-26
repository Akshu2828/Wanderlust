"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ReviewForm from "./ReviewForm";
import ListingActions from "./ListingActions";
import MapView from "./MapView";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  country: string;
  categories: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  owner: {
    _id: string;
    name: string;
  };
  reviews: {
    _id: string;
    rating: number;
    comment: string;
    author: {
      _id: string;
      name: string;
      email: string;
    };
  }[];
}

interface DecodedToken {
  id: string;
  name: string;
  email: string;
}

export default function ListingDetailsClient({ id }: { id: string }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing?id=${id}`);
        const data = await res.json();
        console.log("RESPONSE DATA", data);

        setListing(data.listing);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [id]);

  const refreshListing = async () => {
    try {
      const res = await fetch(`/api/listing?id=${id}`);

      const data = await res.json();
      setListing(data.listing);
    } catch (err) {
      console.error("Error refreshing listing:", err);
    }
  };

  const renderStars = (rating: number) => {
    const totalStars = 5;
    return (
      <div className="flex space-x-1 text-yellow-500">
        {Array.from({ length: totalStars }, (_, i) => (
          <span key={i}>{i < rating ? "★" : "☆"}</span>
        ))}
      </div>
    );
  };

  const handleDeleteReview = async (reviewId: string) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/review/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", res);

      if (!res.ok) throw new Error("Failed to delete review");

      refreshListing();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />

      <p className="text-md text-gray-600">Owner:@{listing.owner.name}</p>

      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <p className="text-lg text-gray-700 mb-2">{listing.description}</p>
      <p className="text-xl font-semibold text-blue-600 mb-2">
        ₹{listing.price}
      </p>
      <p className="text-md text-gray-500 mb-2">
        {listing.location}, {listing.country}
      </p>
      <p className="text-sm text-gray-600">
        Categories: {listing.categories.join(", ")}
      </p>
      <ListingActions listingId={listing._id} ownerId={listing.owner._id} />
      <ReviewForm
        listingId={listing._id}
        userId={userId || ""}
        onReviewAdded={refreshListing}
      />
      {listing.reviews.length > 0 ? (
        <div className="mt-10 w-full">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listing.reviews.map((review) => (
              <div
                key={review._id}
                className="border p-4 rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="font-medium text-gray-800">
                  @{review.author.name}
                </p>
                {renderStars(review.rating)}

                <p className="text-gray-700 mt-1">{review.comment}</p>
                {userId === review.author._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-10 text-gray-500">No reviews yet.</p>
      )}

      <MapView
        lat={listing.coordinates.lat}
        lng={listing.coordinates.lng}
        title={listing.title}
      />
    </div>
  );
}
