"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ContactPidgeon() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [position, setPosition] = useState(null);
  const [isAtRightEdge, setIsAtRightEdge] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  // GSAP entrance animation
  useEffect(() => {
    if (isLoaded && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { 
          x: 30
        },
        {
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2
        }
      );
    }
  }, [isLoaded]);

  // Handle window resize for dragging
  useEffect(() => {
    const handleResize = () => {
      if (!position || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const maxLeft = window.innerWidth - rect.width - 24;
      
      if (position.left >= maxLeft || isAtRightEdge) {
        setPosition({ left: maxLeft, top: position.top });
        setIsAtRightEdge(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, isAtRightEdge]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragStart({
        mouseX: e.clientX,
        mouseY: e.clientY,
        elemX: rect.left,
        elemY: rect.top
      });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragStart) return;
    
    const diffX = Math.abs(e.clientX - dragStart.mouseX);
    const diffY = Math.abs(e.clientY - dragStart.mouseY);
    
    if (diffX > 5 || diffY > 5) {
      setIsDragging(true);
    }
    
    if (isDragging && containerRef.current) {
      const deltaX = e.clientX - dragStart.mouseX;
      const deltaY = e.clientY - dragStart.mouseY;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      let newLeft = Math.max(0, Math.min(dragStart.elemX + deltaX, window.innerWidth - rect.width));
      let newTop = Math.max(0, Math.min(dragStart.elemY + deltaY, window.innerHeight - rect.height));
      
      setPosition({ left: newLeft, top: newTop });
      
      if (newLeft < window.innerWidth - rect.width - 34) {
        setIsAtRightEdge(false);
      }
    }
  }, [dragStart, isDragging]);

  const handleMouseUp = useCallback(() => {
    setDragStart(null);
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  const handleClick = (e) => {
    // Only open email if not dragging
    if (isDragging) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (dragStart) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragStart, handleMouseMove, handleMouseUp]);

  return (
    <a
      href="mailto:hello@urbanex.co.nz"
      onClick={handleClick}
      ref={containerRef}
      className="contact-pidgeon"
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'fixed',
        right: position ? 'auto' : '24px',
        bottom: position ? 'auto' : '24px',
        left: position ? `${position.left}px` : 'auto',
        top: position ? `${position.top}px` : 'auto',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: isLoaded ? 1 : 0,
        textDecoration: 'none'
      }}
    >
      <div className="pigeon-wrapper">
        <div className="pigeon-normal">
          <Image
            src="/assets/Urbanex_mail.svg"
            alt="Contact-Pidgeon"
            width={553}
            height={367}
            style={{
              clipPath: isHovered ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)',
              transition: 'clip-path 300ms ease'
            }}
            priority
            quality={95}
            draggable={false}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
        
        <div className="pigeon-hover">
          <Image
            src="/assets/Urbanex_mail_expand.svg"
            alt="Contact-Pidgeon-Expanded"
            width={553}
            height={367}
            style={{
              clipPath: isHovered ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease'
            }}
            quality={95}
            draggable={false}
          />
        </div>
      </div>
      
      <style jsx>{`
        .contact-pidgeon {
          width: 276.5px;
          transition: width 800ms ease-in;
        }
        
        .pigeon-wrapper {
          position: relative;
          width: 90%;
          height: 0;
          padding-bottom: 59.73%;
        }
        
        .pigeon-normal,
        .pigeon-hover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .pigeon-normal :global(img),
        .pigeon-hover :global(img) {
          object-fit: contain;
        }
        
        @media (max-width: 767px) {
          .contact-pidgeon {
            width: 220px;
          }
        }
      `}</style>
    </a>
  );
}