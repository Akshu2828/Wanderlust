"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterIcons from "./FilterIcons";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  country: string;
  categories: string[];
}

export default function ListingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        let url = "/api/listings";
        const queryParams = new URLSearchParams();
        if (search) {
          queryParams.append("search", search);
        }
        if (category) {
          queryParams.append("category", category);
        }

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        setListings(data.listings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, search]);

  return (
    <div className="p-6 flex flex-col gap-6">
      <FilterIcons />
      {(category || search) && (
        <p className="text-sm text-gray-500">
          Showing results
          {category && ` for category: "${category}"`}
          {search && ` matching: "${search}"`}
        </p>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div
              onClick={() => router.push(`/listing/${listing._id}`)}
              key={listing._id}
              className="border border-gray-300 p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <p className="text-gray-700">{listing.description}</p>
              <p className="text-blue-600 font-bold">₹{listing.price}</p>
              <p className="text-sm text-gray-500">
                {listing.location}, {listing.country}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
