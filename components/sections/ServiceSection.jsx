"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function ServicesSection({ id }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const textRef = useRef(null);
  const categoryRefs = useRef([]);

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

        const allBorders = section.querySelectorAll('.border-line');
        gsap.set(allBorders, {
          scaleX: 0,
          transformOrigin: "left center",
          force3D: true
        });

        const validRefs = categoryRefs.current.filter(ref => ref !== null);
        const allButtons = section.querySelectorAll('button');
        
        gsap.set(allButtons, {
          opacity: 0,
          y: 15,
          force3D: true
        });

        // Optimized pin
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=300%", // Reduced from 400%
          pin: true,
          pinSpacing: true,
          anticipatePin: 1
        });

        // Optimized timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=300%",
            scrub: 0.5, // Reduced scrub for smoother mobile
            invalidateOnRefresh: true
          }
        });

        // Text animation - batch for performance
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

        // Collect all lines
        const allLines = [];
        validRefs.forEach((row) => {
          const buttons = row.querySelectorAll('button');
          buttons.forEach(btn => allLines.push(btn));
        });

        // Animate lines in batches
        const lineBatchSize = 3;
        let lineStartTime = 1;
        for (let i = 0; i < allLines.length; i += lineBatchSize) {
          const batch = allLines.slice(i, i + lineBatchSize);
          tl.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out",
            stagger: 0.03
          }, lineStartTime);
          lineStartTime += 0.15;
        }

        // Borders animation
        tl.to(allBorders, {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut"
        }, lineStartTime);

        // Clear will-change
        tl.set([...split.words, ...allButtons, ...allBorders], { 
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

  const categories = {
    "Digital": [
      "Web Design",
      "Web Development",
      "E-Commerce",
      "Search Engine Optimization",
      "Brand Identity and Systems"
    ],
    "Content Creation": [
      "Animation",
      "Illustration",
      "Motion Graphics",
      "Art Direction",
      "Copy Writing",
      "Social Media Tamplate"
    ]
  };

  return (
    <section
      id={id} 
      ref={sectionRef}
      className="relative min-h-screen"
      style={{ paddingBottom: '80px' }}
    >
      <div 
        ref={contentRef}
        className="relative"
        style={{
          opacity: isMounted ? undefined : 0,
          zIndex: 10,
          padding: '30px',
        }}
      >
        <div
          style={{
            marginTop: isMobile ? '5vh' : '10vh',
            width: isMobile ? '100%' : 'calc((100vw - 60px - 220px) / 12 * 7 + 120px)',
            marginLeft: isMobile ? '0' : 'calc((100vw - 60px - 220px) / 12 * 2 + 40px)',
            paddingLeft: '8px',
          }}
        >
          <p
            ref={textRef}
            style={{
              fontSize: isMobile ? '24px' : '50px',
              textAlign: 'left',
              lineHeight: '1',
              color: '#FFF',
              marginBottom: '24px',
            }}
          >
            We craft design and development with flare.
            <br /><br />
            Our capabilities include ... ↓
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
              marginTop: '24px',
            }}
          >
            {Object.entries(categories).map(([category, items], catIndex) => (
              <div 
                key={category} 
                ref={el => categoryRefs.current[catIndex] = el}
                style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: '-1px' }}
              >
                <button
                  style={{
                    width: isMobile ? '35%' : '450px',
                    borderTop: 'none',
                    borderBottom: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    backgroundColor: 'transparent',
                    fontSize: isMobile ? '16px' : '32px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '0px',
                    padding: '12px 16px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    color: '#FFF',
                    lineHeight: isMobile ? '1.2' : 'normal',
                    position: 'relative',
                  }}
                >
                  <div className="border-line" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundColor: '#FFFF',
                  }}></div>
                  <div className="border-line" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundColor: '#FFFF',
                  }}></div>
                  {category}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {items.map((item, index) => (
                    <button
                      key={item}
                      style={{
                        width: '100%',
                        borderTop: 'none',
                        borderBottom: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        backgroundColor: 'transparent',
                        fontSize: isMobile ? '16px' : '24px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        marginBottom: '0px',
                        display: 'block',
                        padding: '8px 24px',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        color: '#FFF',
                        position: 'relative',
                      }}
                    >
                      {index === 0 && (
                        <div className="border-line" style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '1px',
                          backgroundColor: '#FFFF',
                        }}></div>
                      )}
                      <div className="border-line" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#FFFF',
                      }}></div>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}