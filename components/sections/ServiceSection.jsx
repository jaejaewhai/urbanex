"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ServicesSection() {
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
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === section) {
          t.kill();
        }
      });
    };
  }, []);

  const categories = {
    "Digital": [
      "Web Design",
      "Full Stack Development",
      "UX & UI Design",
      "E-Commerce",
      "SEO",
      "CMS",
      "Printed Matter",
      "Brand Identity and Systems"
    ],
    "Design": [
      "Object & Furniture",
      "Spatial Design",
      "Editorial",
      "Iconography",
      "Packaging",
      "Exhibition Design"
    ],
    "Content Creation": [
      "Animation",
      "Illustration",
      "Motion Graphics",
      "Art Direction",
      "Copy Writing",
      "Tone of Voice"
    ]
  };

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen"
    >

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative h-full"
        style={{
          opacity: isMounted ? undefined : 0,
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          gap: '20px',
          padding: '30px',
        }}
      >
        {/* Description Text - centered vertically */}
        <div
          style={{
            position: 'absolute',
            top: isMobile ? '5vh' : '10vh',
            width: isMobile ? 'calc(100vw - 60px)' : 'calc((100vw - 60px - 220px) / 12 * 7 + 120px)',
            left: isMobile ? '30px' : 'calc(30px + (100vw - 60px - 220px) / 12 * 2 + 40px)',
            paddingLeft: '8px',
          }}
        >
          <p
            style={{
              fontSize: '50px',
              textAlign: 'left',
              lineHeight: '1',
              color: '#FFF',
            }}
          >
            We care for crafted design and dedicated for development with flare.
            <br /><br />
            Our capabilities include ... ↓
          </p>
        </div>

        {/* Category Containers - 24px below text */}
        <div
          style={{
            position: 'absolute',
            top: isMobile ? 'calc(25vh + 120px + 24px)' : 'calc(30vh + 80px + 24px)',
            width: isMobile ? 'calc(100vw - 60px)' : 'calc((100vw - 60px - 220px) / 12 * 7 + 120px)',
            left: isMobile ? '30px' : 'calc(30px + (100vw - 60px - 220px) / 12 * 2 + 40px)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '20px',
          }}
        >
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
              <button
                style={{
                  width: isMobile ? '100%' : '330px',
                  height: '40px',
                  border: '1px solid black',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: '0px',
                }}
              >
                {category}
              </button>

              {items.map((item) => (
                <button
                  key={item}
                  style={{
                    width: isMobile ? '100%' : '330px',
                    height: '40px',
                    border: '1px solid black',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    cursor: 'pointer',
                    marginBottom: '0px',
                    display: 'block',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}