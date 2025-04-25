import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingsClient from "@/components/ListingsClient";

export default async function ListingsPage() {
  return (
    <div>
      <Navbar />
      <ListingsClient />
      <Footer />
    </div>
  );
}
