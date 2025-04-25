"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

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

export default function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listing/${params.id}`);
        const data = await res.json();
        setListing(data.listing);
        setTitle(data.listing.title);
        setDescription(data.listing.description);
        setPrice(data.listing.price);
        setCountry(data.listing.country);
        setLocation(data.listing.location);
        setCategories(data.listing.categories.join(", "));
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      }
    }

    fetchListing();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("country", country);
    formData.append("location", location);
    formData.append("categories", categories);

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const res = await fetch(`/api/listing/${params.id}/edit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        router.push(`/listing/${params.id}`);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!listing) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-3xl p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-4">Edit Your Listing</h1>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Current Image:
            </label>
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-60 sm:h-72 md:h-80 object-cover rounded-lg border"
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-1">
                Change Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                className="block border border-gray-400 rounded-lg py-2 px-4 w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block border border-gray-400 rounded-lg py-2 px-4 w-full"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block border border-gray-400 rounded-lg py-2 px-4 w-full"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="block border border-gray-400 rounded-lg py-2 px-4 w-full"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="block border border-gray-400 rounded-lg py-2 px-4 w-full"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block border border-gray-400 rounded-lg py-2 px-4 w-full"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-1">
                Categories
              </label>
              <input
                name="categories"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="block border border-gray-400 rounded-lg py-2 px-4 w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              Update Listing
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
