"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Adjust this path if your lib folder is elsewhere

export default function RecruiterLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Trigger actual Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      
      // On success, push to the dashboard
      router.push("/recruiter/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      // Clean up Firebase error messages for the UI
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/" className="absolute flex items-center gap-2 text-gray-400 transition-colors top-8 left-8 hover:text-white">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">Recruiter Portal</h2>
          <p className="text-sm text-gray-400">Sign in to access your AI talent pipeline.</p>
        </div>

        {/* Error Message Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: "auto", mb: 16 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 text-sm text-red-200 border rounded-lg bg-red-500/10 border-red-500/20">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium tracking-wider text-gray-400 uppercase">Work Email</label>
            <div className="relative">
              <Mail className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full py-3 pl-10 pr-4 text-white transition-all border rounded-xl bg-white/5 border-white/10 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium tracking-wider text-gray-400 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-3 pl-10 pr-4 text-white transition-all border rounded-xl bg-white/5 border-white/10 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 mb-6 text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-indigo-500" />
              Remember me
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300">Forgot password?</a>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-medium bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-[52px]"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white"
              />
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}