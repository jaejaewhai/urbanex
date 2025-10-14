"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setHasMounted(true);
    }, 100);
  }, []);

  return (
    <Link href="/">
      <div 
        className="logo-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          opacity: isVisible ? 1 : 0
        }}
      >
        <div className="image-wrapper">
          <div className="logo-image">
            <Image
              src="/assets/Urbanex_green.svg"
              alt="Logo"
              width={460}
              height={100}
              style={{
                clipPath: isHovered ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)',
                transition: 'clip-path 600ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              priority
            />
          </div>
          <div className="logo-image-hover">
            <Image
              src="/assets/Urbanex_beige.svg"
              alt="Logo Hover"
              width={460}
              height={100}
              style={{
                clipPath: isHovered ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transition: 'clip-path 600ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              priority
            />
          </div>
        </div>
        <style jsx>{`
          .logo-container {
            cursor: pointer;
            height: 60px;
            transition: ${hasMounted ? 'width 800ms ease-in' : 'none'};
          }
          
          .image-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .logo-image,
          .logo-image-hover {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          .logo-image :global(img),
          .logo-image-hover :global(img) {
            object-fit: contain;
            height: 100%;
            width: auto;
          }
          
          @media (min-width: 768px) {
            .logo-container {
              width: 276px;
            }
          }
          
          @media (max-width: 767px) {
            .logo-container {
              width: 150px;
            }
          }
        `}</style>
      </div>
    </Link>
  );
}