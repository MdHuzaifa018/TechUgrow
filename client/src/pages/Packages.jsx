import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Packages from "@/sections/Packages";
import FAQ from "@/sections/FAQ";

export default function PackagesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <Packages />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
