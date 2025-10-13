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
        // Split text animation when section is in full view
        const textElements = textRefs.current.filter(Boolean);
        const allWords = [];

        textElements.forEach((el, index) => {
          if (el) {
            // Skip the image element for split text
            if (index === 1) {
              // Set initial state for image
              gsap.set(el, {
                opacity: 0,
                scale: 0.8
              });
              allWords.push(el);
              return;
            }

            const split = new SplitType(el, {
              types: 'words, chars',
              tagName: 'span'
            });

            // Wrap each word in overflow hidden container
            split.words.forEach(word => {
              const wrapper = document.createElement('div');
              wrapper.style.overflow = 'hidden';
              wrapper.style.display = 'inline-block';
              word.parentNode.insertBefore(wrapper, word);
              wrapper.appendChild(word);
              allWords.push(word);
            });

            // Add char class
            split.chars.forEach(char => {
              char.classList.add('char');
              char.style.display = 'inline-block';
            });

            // Set initial state
            gsap.set(split.words, {
              y: 100,
              opacity: 0
            });
          }
        });

        // Pin the section during text animation
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
        });

        // Create a master timeline for the reveal animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            scrub: 1,
          }
        });

        // Add animation to timeline with stagger
        tl.to(allWords, {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 1,
          ease: "none"
        }, 0);

        // REMOVED the fade out animation so text stays visible
      });

      // Cleanup
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
        {/* Top lines */}
        <p 
          ref={el => textRefs.current[0] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            lineHeight: '1.2',
            color: '#dad2c3'
          }}
        >
          Kia ora !
        </p>

       {/* Urbanex line */}
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
              src="/assets/Urbanex_beige.webp"
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
              color: '#dad2c3',
              lineheight: '1.2'
            }}
          >
            is
          </span>
        </div>

        {/* Bottom lines */}
        <p 
          ref={el => textRefs.current[3] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            color: '#dad2c3',
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
            color: '#dad2c3',
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
            color: '#dad2c3',
            lineHeight: '1.2',
            marginBottom: '3rem'
          }}
        >
          by Dan & Justine *
        </p>
        
        <p 
          ref={el => textRefs.current[6] = el}
          style={{ 
            fontFamily: 'new-spirit',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: '300',
            margin: '0',
            color: '#dad2c3',
            lineHeight: '1.2'

          }}
        >
          We care about design that grows your business *
        </p>
        
      </div>

      <style jsx global>{`
        .char {
          display: inline-block;
        }
      `}</style>
    </section>
  );
}