"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function AboutSection({ id }) {
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    setIsMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const content = contentRef.current;

    if (section && content) {
      requestAnimationFrame(() => {
        const textElements = textRefs.current.filter(Boolean);
        const allWords = [];

        textElements.forEach((el, index) => {
          if (el) {
            // Image element
            if (index === 1) {
              gsap.set(el, {
                opacity: 0,
                y: 20,
                force3D: true // Force GPU acceleration
              });
              allWords.push(el);
              return;
            }

            // Use SplitType but optimize it
            const split = new SplitType(el, {
              types: 'words', // ONLY words, not chars - much lighter
              tagName: 'span'
            });

            // Set initial state with GPU optimization
            gsap.set(split.words, {
              opacity: 0,
              y: 30, // Reduced distance = less calculation
              force3D: true, // Force GPU layer
              willChange: 'transform, opacity'
            });

            allWords.push(...split.words);
          }
        });

        // Pin the section
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1 // Helps with flickering
        });

        // Optimized timeline with batch rendering
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            scrub: 0.5, // Lower scrub = smoother on mobile
            invalidateOnRefresh: true
          }
        });

        // Animate in batches for better performance
        const batchSize = 3;
        for (let i = 0; i < allWords.length; i += batchSize) {
          const batch = allWords.slice(i, i + batchSize);
          tl.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.05
          }, i * 0.03);
        }

        // Clear will-change after animation
        tl.set(allWords, { willChange: 'auto' });
      });

      return () => {
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
      className="flex justify-center items-center min-h-screen" 
      style={{ 
        position: 'relative',
        zIndex: 40,
        backgroundColor: 'transparent',
        paddingTop: '0',
        marginTop: '0',
        paddingLeft: 'clamp(16px, 5vw, 32px)',
        paddingRight: 'clamp(16px, 5vw, 32px)',
      }}
    >
      <div 
        ref={contentRef}
        style={{ 
          opacity: isMounted ? undefined : 0,
          width: '100%',
          maxWidth: 'clamp(250px, 60vw, 500px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: ''
        }}
      >
        <p 
          ref={el => textRefs.current[0] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            lineHeight: '1.2',
            color: '#FFFFFF'
          }}
        >
          Hello !
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          width: '100%',
          marginBottom: '0.5rem',
        }}>
          <div 
            ref={el => textRefs.current[1] = el}
            style={{
              width: 'clamp(150px, 40vw, 300px)',
              height: 'auto',
            }}>
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
          <span 
            ref={el => textRefs.current[2] = el}
            style={{ 
              fontFamily: 'new-spirit',
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              fontWeight: '300',
              margin: '0',
              color: '#FFF',
              lineheight: '1.2'
            }}
          >
            is
          </span>
        </div>

        <p 
          ref={el => textRefs.current[3] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            color: '#FFF',
            lineHeight: '1.2'
          }}
        >
          Auckland based
        </p>
        
        <p 
          ref={el => textRefs.current[4] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            color: '#FFF',
            lineHeight: '1.2'
          }}
        >
          creative agency
        </p>
        
        <p 
          ref={el => textRefs.current[5] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            color: '#FFF',
            lineHeight: '1.2',
            marginBottom: '3rem'
          }}
        >
          by Dan & Justine
        </p>
        
        <p 
          ref={el => textRefs.current[6] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            color: '#FFF',
            lineHeight: '1.2'
          }}
        >
          We care about design that grows your business
        </p>
      </div>
    </section>
  );
}