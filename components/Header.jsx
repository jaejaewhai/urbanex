"use client";
import { useRef, useEffect } from "react";
import Logo from "my-portfolio/app/components/Logo";
import MenuButton from "my-portfolio/app/components/MenuButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Header() {
  const logoRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const timer = setTimeout(() => {
      const logo = logoRef.current;
      const heroSection = document.querySelector('[data-section="hero"]');
      
      if (logo && heroSection) {
        // Set INITIAL state - logo starts BIG and CENTERED in viewport
        gsap.set(logo, {
          scale: 2,
          y: '50vh',
          x: '-50%',
          yPercent: -50,
        });

        // Create timeline for two-phase animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });

        // Phase 1: Logo moves to header and scales down (0-70%)
        tl.to(logo, {
          scale: 1,
          y: 0,
          x: '-50%',
          yPercent: -50,
          ease: "none",
          duration: 0.7
        })
        // Phase 2: Hold in header position (70-100%)
        .to(logo, {
          scale: 1,
          y: 0,
          x: '-50%',
          yPercent: -50,
          ease: "none",
          duration: 0.3
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <header 
      className="sticky top-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        height: '80px',
        paddingLeft: 'clamp(16px, 4vw, 32px)',
        paddingRight: 'clamp(16px, 4vw, 32px)',
        width: '100%',
        backgroundColor: 'transparent',
      }}
    >
      <div 
        ref={logoRef} 
        className="pointer-events-auto"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
        }}
      >
        <Logo />
      </div>
      <div className="pointer-events-auto absolute" style={{ right: '24px' }}>
        <MenuButton />
      </div>
    </header>
  );
}