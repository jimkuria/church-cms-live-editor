import { Toaster } from "sonner";
import { ChurchProvider } from "@/context/ChurchContext";
import Navbar from "@/components/Navbar";
import HeroAndContent from "@/components/HeroAndContent";
import BooksCatalog from "@/components/BooksCatalog";
import GivingAndFooter from "@/components/GivingAndFooter";
import AdminPortalModal from "@/components/AdminPortalModal";

function App() {
  return (
    <ChurchProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <Navbar />
        <main>
          <HeroAndContent />
          <BooksCatalog />
          <GivingAndFooter />
        </main>
        <AdminPortalModal />
        <Toaster position="top-center" richColors />
      </div>
    </ChurchProvider>
  );
}

export default App;