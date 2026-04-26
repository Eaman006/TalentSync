"use client";

import { motion, Variants } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" // Now TypeScript knows this is a valid Framer Motion ease
      } 
    }
  };
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl"
      >
        <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide text-indigo-400 uppercase border rounded-full bg-indigo-500/10 border-indigo-500/20">
          AI-Powered Talent Scouting
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
          Hire on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Signal.</span> <br />
          Not on Noise.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="max-w-2xl mx-auto mt-8 text-lg text-gray-400 md:text-xl">
          Stop sifting through resumes. TalentSync uses AI to instantly match JDs with the right candidates and engages them conversationally to assess genuine interest.
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      
    </section>
  );
}