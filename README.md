# 🚀 TalentSync | AI-Powered Technical Recruitment Agent

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector-47C28B?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

> **An end-to-end AI recruitment pipeline. TalentSync automates resume parsing, conducts pre-screening chats, and matches candidates to job descriptions using 3072-dimensional vector search.**

[**🎥 Watch the 3-Minute Demo Video Here**](LINK_TO_YOUR_YOUTUBE_OR_LOOM_VIDEO)

---

## 💡 The Problem
Technical recruiters spend thousands of hours manually reading PDFs, doing data entry, and conducting repetitive first-round phone screens just to gauge a candidate's basic fit and interest. Traditional keyword search systems are easily gamed and miss the nuances of a candidate's actual experience.

## ✨ The Solution
**TalentSync** completely automates the top of the hiring funnel using state-of-the-art LLMs and Semantic Search. 
1. **Candidates** drag-and-drop their resume. Gemini 2.5 Flash natively reads the PDF, extracts structured JSON data, and immediately initiates a pre-screening chat to assess their interest and salary expectations.
2. **Recruiters** paste a Job Description. Our vector database instantly performs a cosine similarity search against all candidates, returning ranked matches alongside AI-generated explanations of *why* they fit the role.

---

## 🛠️ Technical Architecture

This prototype was built over a single weekend hackathon sprint, leveraging a modern AI tech stack:

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion (for buttery-smooth UI transitions).
* **Authentication:** Firebase (Google 1-Click for Candidates, Email/Password for Recruiters).
* **AI & Embeddings:** * `gemini-2.5-flash`: Used for native PDF parsing (forcing strict JSON output) and generating the Recruiter "Explainability" summaries.
  * `gemini-embedding-001`: Generates 3072-dimension mathematical representations of candidate profiles and Job Descriptions.
* **Database & Search:** Supabase PostgreSQL with the `pgvector` extension. We wrote custom SQL RPC functions to execute mathematical cosine similarity searches on the fly.
* **Cloud Storage:** Supabase Storage handles the secure upload and retrieval of the original candidate PDF resumes.

---

## 🌟 Key Features

### For Candidates
* **Zero-Friction Application:** 1-Click Google Login and a drag-and-drop PDF upload zone. No lengthy forms.
* **Instant AI Extraction:** The system uses Gemini's multi-modal capabilities to read PDFs natively, completely bypassing messy OCR scripts.
* **TalentSync AI Scout:** An interactive chat UI that simulates a first-round interview, adapting dynamically based on the specific skills extracted from their resume.

### For Recruiters
* **Semantic JD Search:** Paste any unstructured Job Description. The system vectorizes it and finds candidates based on contextual meaning, not just keyword matching.
* **AI Explainability:** Instead of a black-box score, Gemini generates a 2-sentence explanation for *why* a specific candidate matches the JD.
* **Deep Dive Modals:** Recruiters can view the candidate's extracted profile, read the transcript of their AI pre-screening chat, and download the original PDF with one click.

---

## 🚀 Running the Project Locally

Want to run TalentSync on your own machine? Follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/](https://github.com/)[Eaman006]/[TalentSync].git
```
```bash
cd [frontend/my-app]
```
### 2. Install dependencies
```bash
npm install
```


