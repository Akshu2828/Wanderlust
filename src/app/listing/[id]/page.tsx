import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingDetailsClient from "@/components/ListingDetailsClient";

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <>
      <Navbar />
      <ListingDetailsClient id={id} />
      <Footer />
    </>
  );
}
