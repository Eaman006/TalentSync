"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Sparkles, User, FileText, MessageSquare, CheckCircle2, ChevronRight, BarChart } from "lucide-react";

// Mock Data representing the output from your Supabase + Gemini pipeline
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "Alex Mercer",
    role: "Senior Frontend Engineer",
    experience: "5 yrs",
    matchScore: 94,
    interestScore: 88,
    explanation: "Perfect alignment on Next.js and TypeScript. Candidate showed high enthusiasm for the fast-paced startup environment during the AI pre-screen.",
    skills: ["React", "TypeScript", "Tailwind", "Next.js"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    experience: "3 yrs",
    matchScore: 89,
    interestScore: 95,
    explanation: "Strong React background. While slightly under the 4-year requirement, her interest score is exceptional, explicitly stating a willingness to take on architecture roles.",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
  },
];

export default function RecruiterDashboard() {
  const [jdText, setJdText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_CANDIDATES | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText) return;
    
    setIsSearching(true);
    // Simulate API call to Supabase pgvector & Gemini
    setTimeout(() => {
      setResults(MOCK_CANDIDATES);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      {/* Dashboard Navbar */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <Link href="/" className="text-xl font-extrabold tracking-tighter">
          Talent<span className="text-indigo-500">Sync</span> <span className="text-sm font-medium text-gray-500 ml-2 px-2 py-0.5 bg-white/5 rounded-md">Recruiter</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            AI Pipeline Active
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 border border-white/20" />
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Input Area (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm sticky top-24">
              <div className="flex items-center gap-3 mb-4 text-indigo-400">
                <FileText size={20} />
                <h2 className="text-lg font-semibold text-white">Job Description</h2>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Paste your JD below. Our AI will extract requirements and search the talent vector database.
              </p>

              <form onSubmit={handleSearch}>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="e.g. We are looking for a Senior Frontend Engineer with 4+ years of React and Next.js experience..."
                  className="w-full h-[300px] md:h-[400px] p-4 bg-black/50 border border-white/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none mb-4"
                />
                <button
                  type="submit"
                  disabled={isSearching || !jdText}
                  className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-medium bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Scout Candidates
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Results Area (Span 8) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Top Ranked Matches</h2>
              {results && (
                <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {results.length} Candidates Found
                </span>
              )}
            </div>

            {!results && !isSearching && (
              <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <Search size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400 text-center max-w-sm">
                  Enter a job description to trigger the AI matching and candidate pre-screening process.
                </p>
              </div>
            )}

            {isSearching && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="w-full h-[200px] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            )}

            <AnimatePresence>
              {results && !isSearching && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {results.map((candidate, idx) => (
                    <motion.div 
                      key={candidate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-5 md:p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        
                        {/* Candidate Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between md:justify-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl border border-indigo-500/30">
                              {candidate.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {candidate.name}
                                {idx === 0 && <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold text-white">Top Match</span>}
                              </h3>
                              <p className="text-sm text-gray-400">{candidate.role} • {candidate.experience}</p>
                            </div>
                          </div>

                          {/* Explainability Badge */}
                          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-3 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                            <p className="text-sm text-indigo-200 flex items-start gap-2">
                              <Sparkles size={16} className="shrink-0 mt-0.5 text-indigo-400" />
                              <span className="leading-relaxed">{candidate.explanation}</span>
                            </p>
                          </div>

                          {/* Skills Tags */}
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map(skill => (
                              <span key={skill} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Scores & Actions */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-6 md:min-w-[140px] pt-4 md:pt-0 border-t border-white/10 md:border-t-0 md:border-l md:pl-6">
                          
                          <div className="flex gap-6 md:flex-col md:gap-4 md:w-full">
                            <div className="text-center md:text-right md:w-full md:flex md:justify-between md:items-center">
                              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block md:inline">Match</span>
                              <span className="text-xl font-bold text-white">{candidate.matchScore}%</span>
                            </div>
                            <div className="text-center md:text-right md:w-full md:flex md:justify-between md:items-center">
                              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block md:inline">Interest</span>
                              <span className="text-xl font-bold text-emerald-400">{candidate.interestScore}%</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors tooltip-trigger relative group">
                              <MessageSquare size={18} />
                              {/* Tooltip */}
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">View AI Chat</span>
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                              Profile <ChevronRight size={16} />
                            </button>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>
    </div>
  );
}