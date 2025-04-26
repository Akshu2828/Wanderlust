"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCoordinates } from "@/utils/getCoordinates";
import { categoryValues } from "@/utils/categories";
import Select from "react-select";

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState<number>();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [token, setToken] = useState("");

  const router = useRouter();

  const categoryOptions = categoryValues.map((cat) => ({
    value: cat,
    label: cat,
  }));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("token");
      setToken(data || "");
    }
  }, []);

  if (!token) {
    router.push("/authPage?message=Please%20Log%20In%20to%20create%20listing");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return alert("Please upload an image");

    const fullLocation = `${city}, ${country}`;
    const coordinates = await getCoordinates(fullLocation);
    if (!coordinates) {
      alert("Invalid location. Please check the city and country.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    formData.append("upload_preset", "wanderlust_preset");

    const formDataForListing = new FormData();
    formDataForListing.append("title", title);
    formDataForListing.append("description", description);
    formDataForListing.append("price", String(price));
    formDataForListing.append("country", country);
    formDataForListing.append("location", city);
    categories.forEach((cat) => formDataForListing.append("categories", cat));

    formDataForListing.append("image", image);
    formDataForListing.append("coordinates", JSON.stringify(coordinates));

    const res = await fetch("/api/createListing", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formDataForListing,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Listing created!");
      setTitle("");
      setDescription("");
      setImage(null);
      setPrice(0);
      setCountry("");
      setCity("");
      setCategories([]);
      router.push(`/listing/${data.listing._id}`);
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 flex justify-center">
        <form
          className="w-[80vw] h-full flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <p className="w-[80%] text-2xl">Create a New Listing</p>
          <div className="w-[80%] flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="font-medium min-w-[80px]">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a Catchy Title"
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium min-w-[80px]">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center w-full md:w-1/2">
                <label className="font-medium min-w-[80px]">Price</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="1200"
                  type="number"
                  className="px-4 py-2 border rounded-lg w-full"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center w-full md:w-1/2">
                <label className="font-medium min-w-[80px]">Country</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  type="text"
                  className="px-4 py-2 border rounded-lg w-full"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-medium min-w-[80px]">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Pune, Rajasthan, Mumbai"
                type="text"
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 font-semibold">Categories</label>
              <Select
                isMulti
                options={categoryOptions}
                value={categoryOptions.filter((opt) =>
                  categories.includes(opt.value)
                )}
                onChange={(selected) =>
                  setCategories(selected.map((opt) => opt.value))
                }
                className="text-black"
              />
            </div>

            <button
              type="submit"
              className="text-start bg-red-500 w-fit px-4 py-2 text-white font-bold rounded-lg"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateListing;
