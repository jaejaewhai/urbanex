"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection({ className }) {
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const spacerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Force scroll to top on mount
    window.scrollTo(0, 0);
    
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const container = containerRef.current;

    if (section && container) {
      // Add blur effect starting when logo is at 20% progress
      gsap.to(container, {
        opacity: 0.5,
        filter: "blur(3px)",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach(t => {
          if (t.vars.trigger === spacerRef.current || t.vars.trigger === section) {
            t.kill();
          }
        });
      };
    }
  }, []);

  return (
    <>
      {/* Fixed Hero Background */}
      <section 
        ref={sectionRef}
        data-section="hero"
        className="fixed top-0 left-0 w-full h-screen z-[1]"
        style={{
          overflow: 'hidden',
          backgroundColor: '#2d5f4f',
        }}
      >
        <div 
          ref={containerRef}
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100vh',
            zIndex: 10,
          }}
        >
          <img
            src="/assets/hero-background.webp"
            alt="Hero Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      </section>

      {/* Spacer - Control scroll timing HERE */}
      <div 
        ref={spacerRef}
        style={{ height: '100vh' }} // Adjust this ONE value to control when AboutSection scrolls
      />
    </>
  );
}