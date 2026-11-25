import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProfileLookup } from "@/components/ProfileLookup";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-content flex-1 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <ProfileLookup />
      </main>
      <Footer />
    </>
  );
}
