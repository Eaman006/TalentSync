"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { UploadCloud, CheckCircle2, Bot, Send, User, Sparkles, Loader2 } from "lucide-react";

export default function CandidateDashboard() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'parsing' | 'complete'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New state to hold the real data from Gemini
  const [parsedProfile, setParsedProfile] = useState<any>(null);
  
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const processResume = async (uploadedFile: File) => {
    setUploadState('uploading');
    
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
  
      setUploadState('parsing');
      
      // Call our Next.js API Route
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to parse resume");
  
      const data = await response.json();
      
      setParsedProfile(data);
      
      // Dynamically create the first message based on their real resume!
      const firstName = data.name ? data.name.split(" ")[0] : "there";
      const topSkills = data.skills && data.skills.length >= 2 
        ? `${data.skills[0]} and ${data.skills[1]}` 
        : "your tech stack";

      setChatMessages([
        { role: 'ai', content: `Hi ${firstName}! I'm TalentSync AI. I see you have some great experience with ${topSkills}. Are you currently open to new roles?` }
      ]);

      setUploadState('complete');
  
    } catch (error) {
      console.error(error);
      alert("Something went wrong parsing the resume. Please try again.");
      setUploadState('idle'); 
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      processResume(e.target.files[0]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: currentMessage }]);
    setCurrentMessage("");

    // Simulate AI response for the demo
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: `That's great to hear! Given your ${parsedProfile?.experience || 'recent'} years of experience, what kind of engineering challenges are you looking to tackle next?` 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans">
      {/* Dashboard Navbar */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <Link href="/" className="text-xl font-extrabold tracking-tighter">
          Talent<span className="text-indigo-500">Sync</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Candidate Portal</span>
          <div className="w-8 h-8 border rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 border-white/20" />
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-4 md:mt-8">
        
        {/* State 1 & 2: Upload and Processing */}
        <AnimatePresence mode="wait">
          {uploadState !== 'complete' && (
            <motion.div 
              key="upload-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="max-w-2xl mx-auto mt-12 md:mt-24"
            >
              <div className="mb-8 text-center">
                <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Let's build your AI profile.</h1>
                <p className="text-gray-400">Upload your resume. Our AI will handle the data entry.</p>
              </div>

              <div 
                onClick={() => uploadState === 'idle' && fileInputRef.current?.click()}
                className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
                  uploadState === 'idle' 
                    ? 'border-white/20 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/50 cursor-pointer' 
                    : 'border-cyan-500/50 bg-cyan-950/20 cursor-default'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept=".pdf" 
                  className="hidden" 
                />

                {uploadState === 'idle' ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-cyan-500/10 text-cyan-400">
                      <UploadCloud size={32} />
                    </div>
                    <p className="mb-1 text-lg font-medium text-white">Click or drag PDF to upload</p>
                    <p className="text-sm text-gray-500">Max file size: 5MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-6">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="flex items-center justify-center w-16 h-16 border-4 rounded-full border-cyan-500/20 border-t-cyan-500"
                    >
                      <Sparkles className="absolute text-cyan-400" size={24} />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-white">
                        {uploadState === 'uploading' ? 'Uploading document...' : 'AI is extracting your profile...'}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        {uploadState === 'parsing' && <Loader2 size={14} className="animate-spin" />}
                        <span>{uploadState === 'parsing' ? 'Reading data with Gemini 1.5...' : 'Securing file'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* State 3: Complete & Chat */}
          {uploadState === 'complete' && parsedProfile && (
            <motion.div 
              key="dashboard-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
            >
              {/* Left Column: Parsed Profile */}
              <div className="space-y-6 lg:col-span-4">
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                      <CheckCircle2 size={14} /> AI Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold text-white rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500">
                    {parsedProfile.name?.charAt(0) || "U"}
                  </div>
                  <h2 className="mb-1 text-2xl font-bold text-white">{parsedProfile.name}</h2>
                  <p className="mb-4 text-sm font-medium text-cyan-400">{parsedProfile.role} • {parsedProfile.experience} Yrs Exp</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Summary</h3>
                      <p className="text-sm leading-relaxed text-gray-300">{parsedProfile.bio}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Top Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {parsedProfile.skills?.map((skill: string) => (
                          <span key={skill} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Pre-Screen Chat */}
              <div className="lg:col-span-8 flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl h-[600px] overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-white">
                        TalentSync AI <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Scout</span>
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {chatMessages.map((msg, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx} 
                      className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/10 text-white'}`}>
                        {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'ai' ? 'bg-white/5 text-gray-200 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t bg-black/50 border-white/10">
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input 
                      type="text" 
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your response to TalentSync AI..."
                      className="w-full py-3.5 pl-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!currentMessage.trim()}
                      className="absolute p-2 transition-colors rounded-lg right-2 text-indigo-400 hover:text-indigo-300 hover:bg-white/5 disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                  <p className="text-center text-[10px] text-gray-500 mt-2">TalentSync AI is analyzing your responses to calculate your Interest Score.</p>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}