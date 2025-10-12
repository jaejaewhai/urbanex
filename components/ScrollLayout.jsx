"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

export default function ScrollLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Use ONLY gsap.ticker to call lenis.raf
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Wait a bit for sections to render
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setCurrentSection(index),
          onEnterBack: () => setCurrentSection(index),
        });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
      gsap.ticker.remove(() => {}); // Remove ticker callback
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {children}

      {isMounted && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 scroll-indicator">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSection === index ? 'bg-black scale-150' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}