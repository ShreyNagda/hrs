import AboutSection from "@/components/About";
import Footer from "@/components/Footer";
import Hairstyles from "@/components/Hairstyles";
import Hero from "@/components/Hero";
import { div } from "framer-motion/client";
import Image from "next/image";

export default function Home() {
    return (
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
            <Hero />
            <AboutSection />
            <Hairstyles />
            <Footer />
        </div>
    );
}
