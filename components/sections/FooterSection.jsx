"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FooterSection() {
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const content = contentRef.current;

    if (section && content) {
      gsap.fromTo(
        content,
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top center",
            scrub: 1,
          },
          opacity: 1,
          ease: "none",
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[10vh]">
      <div
        ref={contentRef}
        className="h-full flex flex-col items-center justify-center px-8 text-center"
        style={{ opacity: isMounted ? undefined : 0 }}
      >
        <div className="max-w-4xl mx-auto">
          <Image
            src="/assets/Urbanex_transparent.webp"
            alt="Urbanex Logo"
            width={300}
            height={300}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
        
        <div className="w-48 h-0.5 bg-black mx-auto my-12"></div>

        <div className="inline-flex items-center gap-4 px-8 py-4 border-2 border-black mb-12">
          <span className="text-3xl">✉</span>
          <span className="text-xl font-semibold tracking-wider">CORRESPONDENCE WELCOME</span>
        </div>

        <p className="text-lg opacity-60 mb-8">
          {/* Add your contact info here */}
        </p>

        <div className="flex justify-center gap-8 text-sm tracking-wider">
          <a href="#" className="hover:opacity-60 transition-opacity">PRIVACY</a>
          <a href="#" className="hover:opacity-60 transition-opacity">TERMS</a>
          <a href="#" className="hover:opacity-60 transition-opacity">© 2024 URBANEX</a>
        </div>
      </div>
    </section>
  );
}