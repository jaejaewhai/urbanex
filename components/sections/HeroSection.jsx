"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection({ className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const spacerRef = useRef(null);
  const animationRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const lastScrollYRef = useRef(0);
  const colorUpdateTimeoutRef = useRef(null);

  const palettes = [
    ['#D95B43', '#7E2F2F'],
    ['#8A4B3A', '#523F38'],
    ['#B84592', '#3B2C35'],
    ['#FFA69E', '#401F3E'],
    ['#FF6F61', '#1C1C1C'],
    ['#FB8B24', '#3D1E6D']
  ];

  const getRandomPalette = () => {
    return palettes[Math.floor(Math.random() * palettes.length)];
  };

  const updateColors = () => {
    const [color1, color2] = getRandomPalette();
    if (layer1Ref.current && layer2Ref.current) {
      // Use GSAP for smooth color transitions
      gsap.to(layer1Ref.current, {
        background: `radial-gradient(circle at center, ${color1}, transparent 70%)`,
        duration: 1.5,
        ease: "power2.inOut"
      });
      gsap.to(layer2Ref.current, {
        background: `radial-gradient(circle at center, ${color2}, transparent 70%)`,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  };

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

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

    // Initialize colors
    updateColors();

    // Optimized scroll listener with throttling
    const handleScroll = () => {
      // Clear existing timeout
      if (colorUpdateTimeoutRef.current) {
        clearTimeout(colorUpdateTimeoutRef.current);
      }

      const newY = window.scrollY;
      const scrollThreshold = isMobile ? 50 : 10; // Less frequent updates on mobile
      
      if (Math.abs(newY - lastScrollYRef.current) > scrollThreshold) {
        // Debounce color updates on mobile
        if (isMobile) {
          colorUpdateTimeoutRef.current = setTimeout(() => {
            updateColors();
            lastScrollYRef.current = newY;
          }, 100);
        } else {
          updateColors();
          lastScrollYRef.current = newY;
        }
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize animation
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
            scrub: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          }
        });
      });
    };

    // Initialize after mount
    initAnimation();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
      
      if (colorUpdateTimeoutRef.current) {
        clearTimeout(colorUpdateTimeoutRef.current);
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
  }, [isMobile]);

  return (
    <>
      {/* Fixed Hero Background */}
      <section
        ref={sectionRef}
        data-section="hero"
        className="fixed top-0 left-0 w-full h-screen z-[1]"
        style={{
          overflow: 'hidden',
          backgroundColor: '',
        }}
      >
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100vh',
            zIndex: 10,
            opacity: isLoaded ? 1 : 0,
            transition: isLoaded ? 'none' : 'opacity 0.3s ease-in',
          }}
        >
        <div className="relative w-full h-full">
         
          
          {/* Rothko Blobs */}
          <div
            ref={layer1Ref}
            className={`rothko-blob ${isMobile ? 'mobile' : ''}`}
            style={{
              animationDelay: '0s',
            }}
          />
          <div
            ref={layer2Ref}
            className={`rothko-blob ${isMobile ? 'mobile' : ''}`}
            style={{
              animationDelay: '15s',
              opacity: 0.5,
            }}
          />
          
          {/* Rothko Blobs */}
          <div
            ref={layer1Ref}
            className={`rothko-blob ${isMobile ? 'mobile' : ''}`}
            style={{
              animationDelay: '0s',
            }}
          />
          <div
            ref={layer2Ref}
            className={`rothko-blob ${isMobile ? 'mobile' : ''}`}
            style={{
              animationDelay: '15s',
              opacity: 0.5,
            }}
          />
        </div>
      </div>
      </section>

      {/* Hero Content */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        {/* Your hero content goes here - add your text, buttons, etc. */}
      </section>

      {/* Spacer - Control scroll timing HERE */}
      <div ref={spacerRef} style={{ height: '100vh' }} />

      <style jsx>{`
        .rothko-blob {
          position: fixed;
          top: 10vh;
          left: 10vw;
          width: 80vw;
          height: 80vh;
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
          mix-blend-mode: screen;
          background: radial-gradient(circle at center, red, transparent 70%);
          filter: blur(40px);
          animation: drift 30s ease-in-out infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        /* Mobile optimizations */
        .rothko-blob.mobile {
          animation: drift-mobile 40s ease-in-out infinite;
          filter: blur(30px);
          opacity: 0.5;
        }

        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(10vw, -8vh, 0) scale(1.05);
          }
          50% {
            transform: translate3d(0, 12vh, 0) scale(1);
          }
          75% {
            transform: translate3d(-10vw, 8vh, 0) scale(0.95);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        /* Simpler, slower animation for mobile */
        @keyframes drift-mobile {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(5vw, 8vh, 0) scale(1.02);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rothko-blob {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}