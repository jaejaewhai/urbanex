"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(null);
  
  const [isHovering, setIsHovering] = useState(false);
  
  const menuItemsRef = useRef([]);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const menuItems = [
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" }
  ];

  const handleMenuClick = () => {
    if (isDragging) return;
    
    if (open) {
      gsap.to(menuItemsRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: () => {
          setOpen(false);
          menuItemsRef.current = [];
        }
      });
    } else {
      setOpen(true);
    }
  };

  const handleMenuItemClick = (path) => {
    if (!isDragging) {
      router.push(path);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
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

  const handleMouseMove = (e) => {
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
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setTimeout(() => setIsDragging(false), 50);
  };

  useEffect(() => {
    if (open && menuItemsRef.current.length > 0) {
      gsap.fromTo(
        menuItemsRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [open]);

  useEffect(() => {
    if (dragStart) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragStart, isDragging]);

  useEffect(() => {
    const updateScale = () => {
      const newScale = window.innerWidth >= 768 ? 1 : 0.7;
      setScale(newScale);
    };

    const handleResize = () => {
      updateScale();
      
      if (position && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        let currentLeft = position.left;
        let currentTop = position.top;
        
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        
        const newLeft = Math.max(0, Math.min(currentLeft, maxLeft));
        const newTop = Math.max(0, Math.min(currentTop, maxTop));
        
        setPosition({ left: newLeft, top: newTop });
      }
    };
    
    setIsVisible(true);
    updateScale();
    setTimeout(() => {
      setHasMounted(true);
    }, 100);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  const addToMenuRefs = (el) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
      el.style.transition = "background-color 500ms ease-in, border-color 500ms ease-in";
      el.style.outline = "none";
      
      el.addEventListener("mouseenter", () => {
        el.style.backgroundColor = "#3b82f6";
      });
      el.addEventListener("mouseleave", () => {
        el.style.backgroundColor = "rgba(218, 210, 195, 0.8)";
        el.style.borderColor = "black";
      });
      
      el.addEventListener("focus", () => {
        el.style.outline = "none";
        el.style.borderColor = "black";
      });
      el.addEventListener("blur", () => {
        el.style.borderColor = "black";
      });
    }
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="menu-button-container"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isVisible ? 1 : 0,
          position: position ? 'fixed' : 'absolute',
          top: position ? `${position.top}px` : '50%',
          right: position ? 'auto' : '0',
          left: position ? `${position.left}px` : 'auto',
          transform: position ? 'none' : 'translateY(-50%)'
        }}
      >
        <div className="menu-content-wrapper">
          <button
            ref={buttonRef}
            onMouseDown={handleMouseDown}
            onClick={handleMenuClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="backdrop-blur-md border-2 border-black rounded-[100px] cursor-grab active:cursor-grabbing text-center shadow-lg menu-button"
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              backgroundColor: isHovering ? '#3b82f6' : 'rgba(218, 210, 195, 0.8)',
              transition: 'background-color 800ms ease-in',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            Menu
          </button>
          
          {open && (
            <div className="dropdown-container">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  ref={addToMenuRefs}
                  className="backdrop-blur-md border-2 border-black rounded-[100px] cursor-pointer text-center opacity-0 shadow-lg"
                  style={{
                    padding: '16px 32px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(218, 210, 195, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .menu-button-container {
          transform-origin: ${scale < 1 ? 'right center' : 'center'};
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          transition: ${hasMounted ? 'opacity 800ms ease-in' : 'none'};
        }

        .menu-content-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          transform-origin: right center;
          transition: ${hasMounted ? 'transform 800ms ease-in' : 'none'};
        }

        .dropdown-container {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: flex-end;
        }

        .menu-button:hover {
          background-color: #3b82f6;
        }

        @media (min-width: 768px) {
          .menu-content-wrapper {
            transform: scale(1);
          }
        }

        @media (max-width: 767px) {
          .menu-content-wrapper {
            transform: scale(0.8);
          }
        }
      `}</style>
    </>
  );
}