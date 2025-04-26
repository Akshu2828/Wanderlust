"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingDetailsClient from "@/components/ListingDetailsClient";
import { useParams } from "next/navigation";

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  return (
    <>
      <Navbar />
      <ListingDetailsClient id={id} />
      <Footer />
    </>
  );
}
