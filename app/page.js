"use client";
import ScrollLayout from "@/components/ScrollLayout";
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ServiceSection from '@/components/sections/ServiceSection'
import FeaturedWorksSection from '@/components/sections/FeaturedWorksSection' // Add this import
import FooterSection from '@/components/sections/FooterSection'

export default function Home() {
  return (
    <>
      {/* Hero includes its own spacer */}
      <HeroSection id="hero" />
      
      {/* Scrolling Sections */}
      <div className="relative z-[2]">
        <ScrollLayout>
          <AboutSection id="about" />
          <ServiceSection id="services" />
          <FeaturedWorksSection id="works" /> {/* Add this line */}
          <FooterSection id="contact" />
        </ScrollLayout>
      </div>
    </>
  );
}