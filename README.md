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
### 3. Set up Environment Variables
Create a .env.local file in the root directory and add your keys:
```bash
# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"

# Supabase (Database & Storage)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Firebase (Authentication)
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_firebase_app_id"
```
### 4. Supabase Database Setup
You will need to run the following SQL in your Supabase SQL Editor to initialize the vector database and storage bucket:
```bash
-- Enable Vector Search
create extension if not exists vector;

-- Create Candidates Table
create table candidates (
  id bigint primary key generated always as identity,
  name text not null,
  role text not null,
  experience integer default 0,
  skills text[] default '{}',
  bio text,
  resume_url text,
  embedding vector(3072), 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Storage Bucket
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true);
create policy "Allow public uploads" on storage.objects for insert to public with check ( bucket_id = 'resumes' );
create policy "Allow public views" on storage.objects for select to public using ( bucket_id = 'resumes' );

-- Create Vector Search Function
create or replace function match_candidates (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (id bigint, name text, role text, experience integer, skills text[], bio text, resume_url text, similarity float)
language sql stable as $$
  select id, name, role, experience, skills, bio, resume_url, 1 - (embedding <=> query_embedding) as similarity
  from candidates where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding limit match_count;
$$;
```
### 5. Start the Development Server
```bash
npm run dev
```


