"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface Props {
  listingId: string;
  ownerId: string;
}

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
}

export default function ListingActions({ listingId, ownerId }: Props) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.id === ownerId) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, [ownerId]);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirm) return;

    const res = await fetch(`/api/listing/delete?id=${listingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      router.push("/");
    } else {
      const error = await res.json();
      alert(error?.error || "Failed to delete listing");
    }
  };

  if (!isOwner) return null;

  return (
    <div className="flex space-x-4 mt-4">
      <button
        className="bg-red-500 px-4 py-2 rounded-lg mt-2 text-white font-semibold cursor-pointer hover:bg-red-600 transition duration-200"
        onClick={() => router.push(`/listing/${listingId}/edit`)}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="bg-black ml-2 px-4 py-2 rounded-lg mt-2 text-white font-semibold cursor-pointer hover:bg-gray-800 transition duration-200"
      >
        Delete
      </button>
    </div>
  );
}
