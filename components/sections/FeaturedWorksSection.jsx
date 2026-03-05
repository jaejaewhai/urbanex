"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturedWorksSection({ id }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const worksRef = useRef([]);
  const videoRef = useRef(null);

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
    const title = titleRef.current;

    if (section && content && title) {
      requestAnimationFrame(() => {
        const validWorks = worksRef.current.filter(Boolean);

        gsap.set(title, {
          opacity: 0,
          y: 30,
          force3D: true
        });

        gsap.set(validWorks, {
          opacity: 0,
          y: 50,
          force3D: true
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%",
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });

        tl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        }, 0);

        tl.to(validWorks, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out"
        }, 0.3);

        tl.set([title, ...validWorks], { willChange: 'auto' });
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

  const projects = [
    {
      title: "Oh My Croffle",
      description: [
        { text: "VISUAL IDENTITY", isButton: true },
        { text: " for online presence, ", isButton: false },
        { text: "ILLUSTRATION", isButton: true },
        { text: ", ", isButton: false },
        { text: "ANIMATION", isButton: true },
        { text: ", ", isButton: false },
        { text: "MOTION GRAPHICS", isButton: true },
        { text: " for menu items, ", isButton: false },
        { text: "COPY WRITING", isButton: true },
        { text: ", ", isButton: false },
        { text: "SEO OPTIMIZATION", isButton: true },
        { text: ", ", isButton: false },
        { text: "E-COMMERCE", isButton: true },
        { text: ", ", isButton: false },
        { text: "WEB DESIGN & DEVELOPMENT", isButton: true }
      ],
      video: "/videos/Oh My Croffle_Website 211125.mp4",
      link: "https://www.ohmycroffle.co.nz"
    }
  ];

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative min-h-screen"
      style={{
        paddingBottom: '80px',
        zIndex: 20,
        position: 'relative'
      }}
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
            maxWidth: isMobile ? '100%' : '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: isMobile ? '24px' : '60px',
            paddingRight: isMobile ? '24px' : '60px',
          }}
        >
          {/* Title */}
          <h2
            ref={titleRef}
            style={{
              fontFamily: 'new-spirit',
              fontSize: isMobile ? '24px' : '50px',
              fontWeight: '300',
              color: '#ffffff',
              marginBottom: isMobile ? '40px' : '60px',
              textAlign: 'left',
              lineHeight: '1'
            }}
          >
            Featured Works
          </h2>

          {/* Projects Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: isMobile ? '32px' : '48px'
            }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                ref={el => worksRef.current[index] = el}
                style={{ display: 'block' }}
              >
                {/* Video - clickable via onClick */}
                <div
                  onClick={() => window.open(project.link, '_blank')}
                  style={{
                    width: '100%',
                    height: 0,
                    paddingBottom: '56.25%',
                    backgroundColor: '#1a1a1a',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <video
                    ref={index === 0 ? videoRef : null}
                    className="project-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none'
                    }}
                  >
                    <source src={project.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Project Title - clickable via anchor */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'new-spirit',
                      fontSize: isMobile ? '24px' : '50px',
                      fontWeight: '300',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}
                  >
                    {project.title}
                  </h3>
                </a>

                {/* Description with buttons - NOT clickable */}
                <div
                  style={{
                    fontFamily: 'new-spirit',
                    fontSize: isMobile ? '18px' : '24px',
                    color: '#ffffff',
                    lineHeight: '1.6',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {project.description.map((item, idx) => 
                    item.isButton ? (
                      <span
                        key={idx}
                        style={{
                          fontFamily: 'new-spirit',
                          fontSize: isMobile ? '18px' : '24px',
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-block',
                          cursor: 'default',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.text}
                      </span>
                    ) : (
                      <span key={idx} style={{ opacity: 0.7 }}>{item.text}</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: isMobile ? '40px' : '60px' }} />
        </div>
      </div>
    </section>
  );
}