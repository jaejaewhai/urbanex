"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FooterSection({ id }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

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

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className="relative"
      style={{
        minHeight: isMobile ? '70vh' : '50vh',
        marginTop: isMobile ? '-10vh' : '0'
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
          style={{
            fontSize: isMobile ? '24px' : '50px',
            textAlign: isMobile ? 'center' : 'right',
            lineHeight: '1.2',
            color: '#FFF',
            marginBottom: isMobile ? '32px' : '48px',
            width: '100%',
            maxWidth: '800px',
            paddingLeft: isMobile ? '16px' : '0',
            paddingRight: isMobile ? '16px' : '0'
          }}
        >
          Grow with us.<br /><br />Hover on the pigeon <br /> to send us a message.
        </p>

        <div 
          className="mx-auto mb-12"
          style={{
            maxWidth: isMobile ? '280px' : '400px',
            width: '100%',
            paddingLeft: isMobile ? '16px' : '0',
            paddingRight: isMobile ? '16px' : '0'
          }}
        >
          <Image
            src="/assets/Urbanex_white.svg"
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

        <p className="text-lg opacity-60 mb-8">
          {/* Add your contact info here */}
        </p>

        <div 
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