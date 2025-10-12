"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export default function AnimatedText({ children, className = "", delay = 0, as = "span" }) {
  const textRef = useRef(null);
  const Component = as;

  useEffect(() => {
    if (!textRef.current || !children) return;

    // Split the text into characters and lines
    const split = new SplitType(textRef.current, { 
      types: 'lines, chars',
      tagName: 'span'
    });

    // Wrap each line in overflow hidden container
    split.lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.display = 'block';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Add the 'char' class to each character
    split.chars.forEach(char => {
      char.classList.add('char');
    });

    // Set initial state
    gsap.set(split.chars, {
      y: 80,
      clipPath: 'inset(0 0 100% 0)'
    });

    // Animate characters with stagger
    gsap.to(split.chars, {
      y: 0,
      clipPath: 'inset(0 0 0% 0)',
      stagger: 0.05,
      delay: delay,
      duration: 0.5,
      ease: "power2.out"
    });

    // Cleanup
    return () => {
      if (split) split.revert();
    };
  }, [children, delay]);

  return (
    <>
      <Component 
        ref={textRef} 
        className={className}
        style={{ overflow: 'hidden', display: 'inline-block' }}
      >
        {children}
      </Component>
      <style jsx global>{`
        .char {
          display: inline-block;
        }
      `}</style>
    </>
  );
}