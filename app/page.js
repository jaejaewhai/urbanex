"use client";
import ScrollLayout from "my-portfolio/app/components/ScrollLayout";
import HeroSection from "my-portfolio/app/components/sections/HeroSection";
import AboutSection from "my-portfolio/app/components/sections/AboutSection";
import ServiceSection from "my-portfolio/app/components/sections/ServiceSection";
import FooterSection from "my-portfolio/app/components/sections/FooterSection";

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