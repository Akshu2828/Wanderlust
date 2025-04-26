import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingsClient from "@/components/ListingsClient";
import { Suspense } from "react";

export default async function ListingsPage() {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading listings...</div>}>
        <ListingsClient />
      </Suspense>
      <Footer />
    </div>
  );
}
