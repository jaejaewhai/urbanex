"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function FooterSection({ id }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const textRef = useRef(null);
  const logoRef = useRef(null);
  const copyrightRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const content = contentRef.current;
    const textElement = textRef.current;
    const logo = logoRef.current;
    const copyright = copyrightRef.current;

    if (section && content && textElement) {
      requestAnimationFrame(() => {
        // Optimize SplitType - only words
        const split = new SplitType(textElement, {
          types: 'words',
          tagName: 'span'
        });

        // GPU-accelerated initial state
        gsap.set(split.words, {
          opacity: 0,
          y: 30,
          force3D: true,
          willChange: 'transform, opacity'
        });

        gsap.set(logo, {
          opacity: 0,
          y: 30,
          scale: 0.9,
          force3D: true,
          willChange: 'transform, opacity'
        });

        gsap.set(copyright, {
          opacity: 0,
          y: 15,
          force3D: true,
          willChange: 'transform, opacity'
        });

        // Optimized pin
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1
        });

        // Optimized timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%",
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });

        // Text animation - batch for performance (same as services)
        const wordBatchSize = 5;
        for (let i = 0; i < split.words.length; i += wordBatchSize) {
          const batch = split.words.slice(i, i + wordBatchSize);
          tl.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            stagger: 0.02
          }, i * 0.015);
        }

        // Logo animation - appears after text
        tl.to(logo, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "+=0.2");

        // Copyright appears last
        tl.to(copyright, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "+=0.1");

        // Clear will-change
        tl.set([...split.words, logo, copyright], { 
          willChange: 'auto' 
        });

        // Optimized fade out
        gsap.to(content, {
          scrollTrigger: {
            trigger: section,
            start: "bottom 40%",
            end: "bottom top",
            scrub: 0.5,
          },
          opacity: 0,
          ease: "none",
        });
      });

      return () => {
        window.removeEventListener('resize', checkMobile);
        ScrollTrigger.getAll().forEach(t => {
          if (t.vars.trigger === section) {
            t.kill();
          }
        });
      };
    }
  }, []);

  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className="relative"
      style={{
        minHeight: isMobile ? '70vh' : '50vh',
      }}
    >
      <div
        ref={contentRef}
        className="h-full flex flex-col items-center justify-center text-center"
        style={{ 
          opacity: isMounted ? undefined : 0,
          padding: isMobile ? '32px 24px' : '64px 32px'
        }}
      >
        {/* CTA Text - above logo */}
        <p
          ref={textRef}
          style={{
            fontSize: isMobile ? '24px' : '50px',
            textAlign: isMobile ? 'center' : 'center',
            lineHeight: '1.2',
            color: '#FFF',
            marginBottom: isMobile ? '32px' : '48px',
            width: '100%',
            maxWidth: '800px',
            paddingLeft: isMobile ? '16px' : '0',
            paddingRight: isMobile ? '16px' : '0'
          }}
        >
          Grow with us.<br /><br />Hover on the pidgeon <br /> to send us a message.
        </p>

        <div 
          ref={logoRef}
          className="mx-auto mb-12"
          style={{
            maxWidth: isMobile ? '280px' : '400px',
            width: '100%',
            paddingLeft: isMobile ? '16px' : '0',
            paddingRight: isMobile ? '16px' : '0'
          }}
        >
          <Image
            src="/assets/Urbanex_transparent.webp"
            alt="Urbanex Logo"
            width={300}
            height={300}
            priority
            quality={95}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        <div 
          ref={copyrightRef}
          className="flex justify-center text-sm text-white tracking-wider"
          style={{
            gap: isMobile ? '8px' : '16px',
            paddingLeft: isMobile ? '16px' : '0',
            paddingRight: isMobile ? '16px' : '0'
          }}
        >
          <a href="#" className="hover:opacity-60 transition-opacity">© 2025 URBANEX</a>
        </div>
      </div>
    </section>
  );
}