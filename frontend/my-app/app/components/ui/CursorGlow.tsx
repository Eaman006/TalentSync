"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]"
      animate={{
        x: mousePosition.x - 250,
        y: mousePosition.y - 250,
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.8 }}
    />
  );
}