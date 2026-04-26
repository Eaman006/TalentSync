import CursorGlow from "./components/ui/CursorGlow";
import Navbar from "./components/ui/Navbar";
import Hero from "./components/ui/Hero";
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
      <CursorGlow />
      <Navbar />
      <Hero />
      
     
    </main>
  );
}
