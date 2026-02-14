import Header from "@/components/landing/Header";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
