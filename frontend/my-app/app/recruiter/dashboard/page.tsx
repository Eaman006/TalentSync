"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Sparkles, MessageSquare, CheckCircle2, ChevronRight, FileText, X, Bot, User, Download } from "lucide-react";

export default function RecruiterDashboard() {
  const [jdText, setJdText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  // Modal & UI State Management
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'chat' | 'profile'>('none');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/match-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText })
      });

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setResults(data);
      
    } catch (error) {
      console.error(error);
      alert("Failed to find matches. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const openModal = (candidate: any, type: 'chat' | 'profile') => {
    setSelectedCandidate(candidate);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal('none');
    setTimeout(() => setSelectedCandidate(null), 300); 
  };

    // Real PDF Download
  const handleDownload = (candidate: any, e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (candidate.resume_url) {
      // Opens the actual PDF in a new tab so they can view/download it
      window.open(candidate.resume_url, '_blank');
    } else {
      alert("No original PDF file found for this candidate.");
    }
  };
    
   
  // Dynamically generate a realistic chat based on their profile data
  const generateChatTranscript = (candidate: any) => {
    if (!candidate) return [];
    const firstName = candidate.name.split(" ")[0];
    const topSkills = candidate.skills?.slice(0, 2).join(" and ") || "your tech stack";
    
    return [
      { role: 'ai', content: `Hi ${firstName}! I'm TalentSync AI. I see you have some great experience with ${topSkills}. Are you currently open to new roles?` },
      { role: 'user', content: `Hi! Yes, I am actively looking for a new ${candidate.role} position.` },
      { role: 'ai', content: `Excellent. Given your background, how comfortable are you taking ownership of technical architecture in a fast-paced environment?` },
      { role: 'user', content: `Very comfortable. In my previous experience, I frequently led architectural decisions and really enjoy that level of responsibility.` },
      { role: 'ai', content: `That is exactly what we are looking for. What are your salary expectations for this transition?` },
      { role: 'user', content: `I'm looking for a competitive rate based on the market, but I'm very open to discussing the total compensation package.` },
      { role: 'ai', content: `Perfect, I've noted your enthusiasm and requirements. I'll pass this along to the hiring manager!` }
    ];
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      
      {/* --- MODAL OVERLAYS --- */}
      <AnimatePresence>
        {activeModal !== 'none' && selectedCandidate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white/[0.02] border-white/10">
                <h3 className="text-lg font-bold">
                  {activeModal === 'chat' ? `AI Pre-Screen: ${selectedCandidate.name}` : `Candidate Profile`}
                </h3>
                <button onClick={closeModal} className="p-1 text-gray-400 transition-colors rounded-lg hover:text-white hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto">
                {activeModal === 'profile' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold border rounded-full bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                        {selectedCandidate.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                        <p className="text-indigo-400">{selectedCandidate.role} • {selectedCandidate.experience}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-xs font-semibold tracking-wider uppercase text-gray-500">AI Summary</h4>
                      <p className="leading-relaxed text-gray-300">{selectedCandidate.bio}</p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Extracted Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill: string) => (
                          <span key={skill} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 border rounded-xl bg-white/5 border-white/10">
                       <div className="flex-1">
                          <p className="text-xs text-gray-400 uppercase">Match Score</p>
                          <p className="text-2xl font-bold text-white">{selectedCandidate.matchScore}%</p>
                       </div>
                       <div className="flex-1 border-l border-white/10 pl-4">
                          <p className="text-xs text-gray-400 uppercase">Interest Score</p>
                          <p className="text-2xl font-bold text-emerald-400">{selectedCandidate.interestScore}%</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {generateChatTranscript(selectedCandidate).map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/10 text-white'}`}>
                          {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'ai' ? 'bg-white/5 text-gray-200 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- END MODAL OVERLAYS --- */}

      {/* Dashboard Navbar */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b bg-black/80 backdrop-blur-xl border-white/10">
        <Link href="/" className="text-xl font-extrabold tracking-tighter">
          Talent<span className="text-indigo-500">Sync</span> <span className="px-2 py-0.5 ml-2 text-sm font-medium text-gray-500 rounded-md bg-white/5">Recruiter</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden gap-2 text-sm text-gray-400 md:flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            AI Pipeline Active
          </div>
          <div className="w-8 h-8 border rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 border-white/20" />
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Input Area (Span 4) */}
          <div className="space-y-6 lg:col-span-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm sticky top-24">
              <div className="flex items-center gap-3 mb-4 text-indigo-400">
                <FileText size={20} />
                <h2 className="text-lg font-semibold text-white">Job Description</h2>
              </div>
              
              <p className="mb-4 text-sm text-gray-400">
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
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white" />
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
                <span className="px-3 py-1 text-sm text-gray-400 border rounded-full bg-white/5 border-white/10">
                  {results.length} Candidates Found
                </span>
              )}
            </div>

            {!results && !isSearching && (
              <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <Search size={48} className="mb-4 text-gray-600" />
                <p className="max-w-sm text-center text-gray-400">
                  Enter a job description to trigger the AI matching and candidate pre-screening process.
                </p>
              </div>
            )}

            {isSearching && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
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
                      className="group p-5 md:p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                        
                        {/* Candidate Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between gap-4 md:justify-start">
                            <div className="flex items-center justify-center w-12 h-12 text-xl font-bold border rounded-full bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                              {candidate.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                                {candidate.name}
                                {idx === 0 && <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold text-white">Top Match</span>}
                              </h3>
                              <p className="text-sm text-gray-400">{candidate.role} • {candidate.experience}</p>
                            </div>
                          </div>

                          {/* Explainability Badge */}
                          <div className="relative p-3 overflow-hidden border rounded-lg bg-indigo-950/30 border-indigo-500/20">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                            <p className="flex items-start gap-2 text-sm text-indigo-200">
                              <Sparkles size={16} className="shrink-0 mt-0.5 text-indigo-400" />
                              <span className="leading-relaxed">{candidate.explanation}</span>
                            </p>
                          </div>

                          {/* Skills Tags */}
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 5).map((skill: string) => (
                              <span key={skill} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 5 && <span className="text-xs px-2.5 py-1 text-gray-500">+{candidate.skills.length - 5} more</span>}
                          </div>
                        </div>

                        {/* Scores & Actions */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-6 md:min-w-[140px] pt-4 md:pt-0 border-t border-white/10 md:border-t-0 md:border-l md:pl-6">
                          
                          <div className="flex gap-6 md:flex-col md:gap-4 md:w-full">
                            <div className="text-center md:text-right md:w-full md:flex md:justify-between md:items-center">
                              <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase md:inline">Match</span>
                              <span className="text-xl font-bold text-white">{candidate.matchScore}%</span>
                            </div>
                            <div className="text-center md:text-right md:w-full md:flex md:justify-between md:items-center">
                              <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase md:inline">Interest</span>
                              <span className="text-xl font-bold text-emerald-400">{candidate.interestScore}%</span>
                            </div>
                          </div>

                          {/* FUNCTIONAL BUTTONS */}
                          <div className="flex gap-2">
                            {/* DOWNLOAD BUTTON */}
                            <button 
                              onClick={(e) => handleDownload(candidate, e)}
                              className="relative p-2 transition-colors rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 tooltip-trigger group"
                            >
                              {downloadingId === candidate.id ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-[18px] h-[18px] border-2 rounded-full border-gray-400/30 border-t-gray-400" />
                              ) : (
                                <Download size={18} />
                              )}
                              <span className="absolute px-2 py-1 text-xs text-white transition-opacity -translate-x-1/2 bg-black rounded opacity-0 pointer-events-none -top-8 left-1/2 group-hover:opacity-100 whitespace-nowrap">Download Resume</span>
                            </button>

                            <button 
                              onClick={() => openModal(candidate, 'chat')}
                              className="relative p-2 transition-colors rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 tooltip-trigger group"
                            >
                              <MessageSquare size={18} />
                              <span className="absolute px-2 py-1 text-xs text-white transition-opacity -translate-x-1/2 bg-black rounded opacity-0 pointer-events-none -top-8 left-1/2 group-hover:opacity-100 whitespace-nowrap">View AI Chat</span>
                            </button>

                            <button 
                              onClick={() => openModal(candidate, 'profile')}
                              className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-black transition-colors bg-white rounded-lg hover:bg-gray-200"
                            >
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