"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Briefcase, UserPlus, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="relative z-50 text-2xl font-extrabold tracking-tighter text-white"
        >
          Talent<span className="text-indigo-500">Sync</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <Link href="/candidate/apply">
            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-all bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 cursor-pointer">
              <UserPlus size={16} />
              I'm a Recruitee
            </button>
          </Link>
          <Link href="/recruiter/login">
            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-all bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] cursor-pointer">
              <Briefcase size={16} />
              I'm a Recruiter
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={toggleMenu}
          className="relative z-50 p-2 text-gray-300 transition-colors hover:text-white focus:outline-none md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-screen gap-6 px-6 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <Link href="/candidate/apply" onClick={toggleMenu} className="w-full max-w-sm cursor-pointer">
              <button className="flex items-center justify-center w-full gap-2 px-5 py-4 text-base font-medium text-white transition-all border bg-white/5 border-white/10 rounded-xl hover:bg-white/10 active:scale-95 cursor-pointer">
                <UserPlus size={18} />
                I'm a Recruitee
              </button>
            </Link>
            <Link href="/recruiter/login" onClick={toggleMenu} className="w-full max-w-sm cursor-pointer">
              <button className="flex items-center justify-center w-full gap-2 px-5 py-4 text-base font-medium text-white transition-all bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] rounded-xl hover:bg-indigo-500 active:scale-95 cursor-pointer">
                <Briefcase size={18} />
                I'm a Recruiter
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}