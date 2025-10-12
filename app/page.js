"use client";
import ScrollLayout from "@/components/ScrollLayout";
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ServiceSection from '@/components/sections/ServiceSection'
import FooterSection from '@/components/sections/FooterSection'

export default function Home() {
  return (
    <>
      {/* Hero includes its own spacer */}
      <HeroSection />
      
      {/* Scrolling Sections */}
      <div className="relative z-[2]">
        <ScrollLayout>
          <AboutSection />
          <ServiceSection />
        </ScrollLayout>
      </div>
    </>
  );
}