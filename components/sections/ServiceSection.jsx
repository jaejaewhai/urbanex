"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export default function ServicesSection( {id} ) {
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
      // Wait for next frame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Split text animation for the description
        const split = new SplitType(textElement, {
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
        });

        // Add char class
        split.chars.forEach(char => {
          char.classList.add('char');
          char.style.display = 'inline-block';
        });

        // Set initial state for words
        gsap.set(split.words, {
          y: 100,
          opacity: 0
        });

        // Get all borders after DOM is ready
        const allBorders = section.querySelectorAll('.border-line');

        // Set initial state for all borders
        gsap.set(allBorders, {
          scaleX: 0,
          transformOrigin: "left center"
        });

        // Get valid category refs
        const validRefs = categoryRefs.current.filter(ref => ref !== null);
        
        // Set initial state for all buttons
        const allButtons = section.querySelectorAll('button');
        gsap.set(allButtons, {
          opacity: 0,
          y: 20
        });

        // Pin the section during animation
        const pinTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=400%",
          pin: true,
          pinSpacing: true,
        });

        // Create a master timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=400%",
            scrub: 1,
          }
        });

        // Add text animation - starts immediately
        tl.to(split.words, {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "none"
        }, 0);

        // Collect all lines (category buttons + item buttons) in order
        const allLines = [];
        validRefs.forEach((row) => {
          const buttons = row.querySelectorAll('button');
          buttons.forEach(btn => {
            allLines.push(btn);
          });
        });

        // Animate each line one by one after text
        allLines.forEach((button, index) => {
          tl.to(button, {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "none"
          }, 1.5 + index * 0.1);
        });

        // Animate all borders together after all lines are revealed
        const bordersStartTime = 1.5 + allLines.length * 0.1;
        tl.to(allBorders, {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut"
        }, bordersStartTime);

        // Fade out on exit
        gsap.to(content, {
          scrollTrigger: {
            trigger: section,
            start: "bottom 40%",
            end: "bottom top",
            scrub: 1,
          },
          y: -100,
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
      "Social Media Tamplet",
      "Search Engine Optimization",
      "Brand Identity and Systems"
    ],
    "Content Creation": [
      "Animation",
      "Illustration",
      "Motion Graphics",
      "Art Direction",
      "Copy Writing",
    ]
  };

  return (
    <section
      id={id} 
      ref={sectionRef}
      className="relative min-h-screen"
      style={{ paddingBottom: '80px' }}
    >
      {/* Content */}
      <div 
        ref={contentRef}
        className="relative"
        style={{
          opacity: isMounted ? undefined : 0,
          zIndex: 10,
          padding: '30px',
        }}
      >
        {/* Description Text - centered vertically */}
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

          {/* Category Containers - directly after text */}
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

      <style jsx global>{`
        .char {
          display: inline-block;
        }
      `}</style>
    </section>
  );
}