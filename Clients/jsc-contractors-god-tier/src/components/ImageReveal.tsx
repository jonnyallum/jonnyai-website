"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageReveal({ src, alt, className }: ImageRevealProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for the spotlight radius
  // If isRevealed is true, we expand the circle to cover the whole image (e.g., 2000px)
  const radius = useSpring(isRevealed ? 2000 : (isHovered ? (isTouch ? 180 : 150) : 0), { stiffness: 200, damping: 30 });

  useEffect(() => {
    radius.set(isRevealed ? 2000 : (isHovered ? (isTouch ? 180 : 150) : 0));
  }, [isHovered, isRevealed, isTouch, radius]);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    updateCoordinates(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const updateCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  const spotlightX = isTouch ? mouseX : springX;
  const spotlightY = isTouch ? mouseY : springY;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isTouch && setIsHovered(true)}
      onMouseLeave={() => !isTouch && setIsHovered(false)}
      onClick={() => setIsRevealed(!isRevealed)}
      onTouchStart={(e) => {
        setIsHovered(true);
        if (e.touches.length > 0) {
          updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden group aspect-[3/2] w-full bg-neutral-200 transition-all duration-700 cursor-pointer",
        !isTouch && "cursor-none",
        "touch-pan-y",
        isRevealed && "shadow-2xl shadow-accent/5",
        className
      )}
    >
      {/* Greyscale Base Layer */}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-transform duration-700 group-hover:scale-105",
          !isRevealed && "grayscale"
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Color Reveal Layer (Spotlight) */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          clipPath: useTransform(
            [spotlightX, spotlightY, radius],
            ([x, y, r]) => `circle(${r}px at ${x}% ${y}%)`
          ),
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>

      {/* Decorative Border / Frame */}
      <div className={cn(
        "absolute inset-0 border pointer-events-none transition-colors duration-500",
        isRevealed ? "border-accent/40" : "border-black/5 group-hover:border-accent/20"
      )} />
      
      {/* Label (Visible on Interaction) */}
      <div className={cn(
        "absolute bottom-4 left-4 z-20 transition-opacity duration-300",
        (isHovered || isRevealed) ? "opacity-100" : "opacity-0"
      )}>
        <span className="text-[9px] uppercase tracking-[0.2em] text-white bg-black/80 px-3 py-1.5 backdrop-blur-sm border-l-2 border-accent font-black">
          {isRevealed ? 'Full Finish Enabled' : (isTouch ? 'Tap & Drag to Reveal • Tap to Lock Color' : 'Craftsmanship Revealed • Click to Lock Color')}
        </span>
      </div>
    </div>
  );
}
