"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection({ className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const spacerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Prevent flash by setting initial state immediately
    if (containerRef.current) {
      gsap.set(containerRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        willChange: "opacity, filter"
      });
    }

    // Force scroll to top on mount
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
    
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const spacer = spacerRef.current;
    const img = imgRef.current;

    // Wait for image to load before showing and animating
    const initAnimation = () => {
      if (!container || !spacer) return;

      // Mark as loaded to show content
      setIsLoaded(true);

      // Use requestAnimationFrame for smooth initialization
      requestAnimationFrame(() => {
        // Create animation with performance optimizations
        animationRef.current = gsap.to(container, {
          opacity: 0.5,
          filter: "blur(3px)",
          ease: "none",
          scrollTrigger: {
            trigger: spacer,
            start: "top bottom",
            end: "bottom top",
            scrub: 1, // Add slight smoothing (lower = more responsive)
            invalidateOnRefresh: true,
            fastScrollEnd: true, // Performance optimization
          }
        });
      });
    };

    // Check if image is already loaded (cached)
    if (img && img.complete) {
      initAnimation();
    } else if (img) {
      img.addEventListener('load', initAnimation);
    }

    // Cleanup
    return () => {
      if (img) {
        img.removeEventListener('load', initAnimation);
      }
      
      // Kill specific ScrollTrigger instances
      if (animationRef.current) {
        animationRef.current.scrollTrigger?.kill();
        animationRef.current.kill();
      }
      
      // Remove will-change to free up resources
      if (container) {
        gsap.set(container, { willChange: "auto" });
      }
    };
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
            opacity: isLoaded ? 1 : 0, // Prevent flash
            transition: isLoaded ? 'none' : 'opacity 0.3s ease-in',
          }}
        >
          <img
            ref={imgRef}
            src="/assets/hero-background.webp"
            alt="Hero Background"
            loading="eager" // Load immediately, not lazy
            decoding="async" // Async decode for better performance
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: 'translateZ(0)', // Force GPU acceleration
              backfaceVisibility: 'hidden', // Reduce repaints
            }}
          />
        </div>
      </section>

      {/* Spacer - Control scroll timing HERE */}
      <div 
        ref={spacerRef}
        style={{ height: '100vh' }}
      />
    </>
  );
}