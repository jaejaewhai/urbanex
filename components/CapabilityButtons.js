"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import gsap from "gsap";

export default function CapabilityButtons({ 
  topPadding = 40,
  sidePadding = 32,
  columnGap = 8,
  rowGap = 100
}) {
  const sceneRef = useRef(null);
  const buttonRefs = useRef([]);
  const [isReady, setIsReady] = useState(false);
  const engineRef = useRef(null);
  const worldRef = useRef(null);
  const runnerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const capabilities = [
    "Web Development",
    "Web Design",
    "Branding",
    "Tone of Voice",
    "SEO",
    "Marketing",
    "Graphic Design",
    "Prints",
    "Automation",
    "E-Commerce",
    "Packaging",
  ];

  const getButtonScale = () => {
    return window.innerWidth < 768 ? 0.6 : 1;
  };

  useEffect(() => {
    if (!sceneRef.current) return;

    const buttons = sceneRef.current.querySelectorAll('.capability-button');
    
    if (buttons.length === 0) return;

    buttonRefs.current = Array.from(buttons);

    buttonRefs.current.forEach(el => {
      el.style.position = "absolute";
      el.style.transformOrigin = "top left";
      el.style.transition = "background-color 300ms ease-in";
      el.style.outline = "none";
      el.style.opacity = '0';
      
      el.addEventListener("mouseenter", () => {
        el.style.backgroundColor = "#3b82f6";
      });
      el.addEventListener("mouseleave", () => {
        el.style.backgroundColor = "rgba(218, 210, 195, 0.8)";
      });
    });
    
    setIsReady(true);

    const { Engine, World, Bodies, Mouse, MouseConstraint, Runner, Body, Events } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 1;
    engine.positionIterations = 10;
    engine.velocityIterations = 10;
    engine.constraintIterations = 2;
    
    const world = engine.world;
    worldRef.current = world;

    const container = sceneRef.current;
    let containerRect = container.getBoundingClientRect();
    
    let viewportWidth = containerRect.width;
    let viewportHeight = containerRect.height;

    const wallThickness = 600;
    
    const floor = Bodies.rectangle(
      viewportWidth / 2,
      viewportHeight + wallThickness / 2,
      viewportWidth + wallThickness * 2,
      wallThickness,
      { 
        isStatic: true,
        friction: 0.8,
        restitution: 0.2,
        label: 'floor'
      }
    );
    
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      viewportHeight / 2,
      wallThickness,
      viewportHeight + wallThickness * 2,
      { 
        isStatic: true,
        friction: 0.8,
        restitution: 0.25
      }
    );
    
    const rightWall = Bodies.rectangle(
      viewportWidth + wallThickness / 2,
      viewportHeight / 2,
      wallThickness,
      viewportHeight + wallThickness * 2,
      { 
        isStatic: true,
        friction: 0.8,
        restitution: 0.25
      }
    );
    
    World.add(world, [floor, leftWall, rightWall]);

    const scale = getButtonScale();
    const buttonBodies = buttonRefs.current.map((el, i) => {
      const w = el.offsetWidth * scale;
      const h = el.offsetHeight * scale;
      
      const startX = Math.random() * (viewportWidth - w) + w / 2;
      const startY = -150 - i * 120;
      const startRotation = (Math.random() - 0.5) * 0.4;
      
      const body = Bodies.rectangle(startX, startY, w, h, {
        restitution: 0.35,
        friction: 0.15,
        frictionAir: 0.02,
        frictionStatic: 0.5,
        density: 150,
        chamfer: { radius: h * 0.5 },
        inertia: Infinity
      });
      
      Body.setInertia(body, body.inertia);
      Body.setAngle(body, startRotation);
      World.add(world, body);

      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: i * 0.1, ease: "power2.out" });

      return {
        body: body,
        element: el,
        width: w,
        height: h,
        scale: scale,
        originalWidth: el.offsetWidth,
        originalHeight: el.offsetHeight,
      };
    });

    setTimeout(() => {
      const topWall = Bodies.rectangle(
        viewportWidth / 2,
        -wallThickness / 2,
        viewportWidth + wallThickness * 2,
        wallThickness,
        { 
          isStatic: true,
          friction: 0.8,
          restitution: 0.25
        }
      );
      World.add(world, topWall);
    }, 3000);

    const mouse = Mouse.create(container);
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { 
        stiffness: 0.8,
        damping: 0.1
      },
    });
    World.add(world, mouseConstraint);

    let dragging = null;
    let originalInertia = null;

    Events.on(mouseConstraint, "startdrag", (event) => {
      dragging = event.body;
      if (dragging) {
        originalInertia = dragging.inertia;
        Body.setInertia(dragging, Infinity);
        Body.setVelocity(dragging, { x: 0, y: 0 });
        Body.setAngularVelocity(dragging, 0);
      }
    });

    Events.on(mouseConstraint, "enddrag", () => {
      if (dragging) {
        Body.setInertia(dragging, originalInertia || 1);
        dragging = null;
        originalInertia = null;
      }
    });

    Events.on(engine, "beforeUpdate", () => {
      if (dragging) {
        const found = buttonBodies.find((b) => b.body === dragging);
        if (found) {
          const minX = found.width / 2;
          const maxX = viewportWidth - found.width / 2;
          const minY = found.height / 2;
          const maxY = viewportHeight - found.height / 2;
          
          Body.setPosition(dragging, {
            x: Math.max(minX, Math.min(maxX, dragging.position.x)),
            y: Math.max(minY, Math.min(maxY, dragging.position.y)),
          });
        }
      }

      buttonBodies.forEach(({ body, height }) => {
        if (body.position.y > viewportHeight + height) {
          Body.setPosition(body, { 
            x: body.position.x, 
            y: viewportHeight - height 
          });
          Body.setVelocity(body, { x: body.velocity.x, y: 0 });
        }
      });
    });

    const runner = Runner.create({
      delta: 1000 / 60,
      isFixed: true
    });
    runnerRef.current = runner;
    Runner.run(runner, engine);

    let physicsActive = true;

    const update = () => {
      if (physicsActive) {
        buttonBodies.forEach(({ body, element, width, height, scale }) => {
          const x = body.position.x - width / 2;
          const y = body.position.y - height / 2;

          element.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad) scale(${scale})`;
        });
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();

    // After physics settle, organize into grid
    setTimeout(() => {
      physicsActive = false;
      
      // Stop physics engine
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);

      // Calculate grid positions with customizable gaps
      const isMobile = window.innerWidth < 768;
      const cols = isMobile ? 2 : 2;
      
      // Responsive values
      const currentTopPadding = isMobile ? Math.max(20, topPadding * 0.4) : topPadding;
      const currentColumnGap = isMobile ? Math.max(20, columnGap * 0.5) : columnGap;
      const currentRowGap = isMobile ? Math.max(40, rowGap * 0.5) : rowGap;
      
      console.log('=== Grid Layout Debug ===');
      console.log('Viewport Width:', viewportWidth);
      console.log('Is Mobile:', isMobile);
      console.log('Column Gap (input):', columnGap);
      console.log('Column Gap (applied):', currentColumnGap);
      console.log('Scale:', scale);
      
      buttonBodies.forEach(({ element, originalWidth, originalHeight }, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        // Get actual scaled dimensions
        const scaledWidth = originalWidth * scale;
        const scaledHeight = originalHeight * scale;
        
        let targetX;
        
        if (cols === 1) {
          // Single column - center
          targetX = (viewportWidth - scaledWidth) / 2;
        } else {
          // Two columns with adjustable gap
          // Calculate available width after removing gap
          const availableWidth = viewportWidth - currentColumnGap;
          const columnWidth = availableWidth / cols;
          
          if (col === 0) {
            // First column - center in left half
            const columnCenter = columnWidth / 2;
            targetX = columnCenter - (scaledWidth / 2);
          } else {
            // Second column - center in right half (after gap)
            const columnCenter = columnWidth + currentColumnGap + (columnWidth / 2);
            targetX = columnCenter - (scaledWidth / 2);
          }
        }
        
        // Top-left positioning
        const targetY = currentTopPadding + (row * currentRowGap);

        gsap.to(element, {
          x: targetX,
          y: targetY,
          rotation: 0,
          duration: 1.5,
          delay: index * 0.1,
          ease: "power3.out",
          onUpdate: function() {
            // Top-left positioning with scale
            element.style.transform = `translate(${this.targets()[0].x}px, ${this.targets()[0].y}px) rotate(0deg) scale(${scale})`;
          }
        });
      });

    }, 4000);

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      const newWidth = newRect.width;
      const newHeight = newRect.height;
      
      viewportWidth = newWidth;
      viewportHeight = newHeight;
      
      if (physicsActive) {
        Body.setPosition(floor, { x: newWidth / 2, y: newHeight + wallThickness / 2 });
        Body.setPosition(leftWall, { x: -wallThickness / 2, y: newHeight / 2 });
        Body.setPosition(rightWall, { x: newWidth + wallThickness / 2, y: newHeight / 2 });

        const newScale = getButtonScale();
        buttonBodies.forEach((item) => {
          const oldScale = item.scale;
          item.scale = newScale;
          item.width = item.originalWidth * newScale;
          item.height = item.element.offsetHeight * newScale;
          
          Body.scale(item.body, newScale / oldScale, newScale / oldScale);
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (worldRef.current) World.clear(worldRef.current);
      if (engineRef.current) Engine.clear(engineRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [topPadding, sidePadding, columnGap, rowGap]);

  return (
    <div ref={sceneRef} className="absolute inset-0 overflow-hidden">
      {capabilities.map((cap) => (
        <button
          key={cap}
          className="capability-button backdrop-blur-md border-2 border-black rounded-[100px] cursor-grab active:cursor-grabbing text-center shadow-lg"
          style={{
            padding: '24px 40px',
            fontSize: '24px',
            backgroundColor: 'rgba(218, 210, 195, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            pointerEvents: 'auto',
          }}
        >
          {cap}
        </button>
      ))}
    </div>
  );
}