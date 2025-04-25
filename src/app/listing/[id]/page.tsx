import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingDetailsClient from "@/components/ListingDetailsClient";

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <Navbar />
      <ListingDetailsClient id={params.id} />
      <Footer />
    </>
  );
}
