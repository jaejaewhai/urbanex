"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedParagraph({ children, className = "", delay = 0 }) {
  const paragraphRef = useRef(null);

  useEffect(() => {
    if (!paragraphRef.current || !children) return;

    const text = typeof children === 'string' ? children : children.toString();
    const words = text.split(' ');
    
    paragraphRef.current.innerHTML = words.map(word => 
      `<span style="display: inline-block; opacity: 0;">${word}&nbsp;</span>`
    ).join('');
    
    const spans = paragraphRef.current.querySelectorAll('span');
    gsap.to(spans, {
      opacity: 1,
      stagger: 0.04,
      delay: delay,
      duration: 0.3,
      ease: "power2.out"
    });

  }, [children, delay]);

  return (
    <p ref={paragraphRef} className={className}>
      {children}
    </p>
  );
}