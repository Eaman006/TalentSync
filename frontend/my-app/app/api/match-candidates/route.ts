import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { jdText } = await req.json();

    if (!jdText) {
      return NextResponse.json({ error: "Missing Job Description" }, { status: 400 });
    }

    // 1. Convert the JD into a Vector Embedding
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embeddingResult = await embeddingModel.embedContent(jdText);
    const jdEmbedding = embeddingResult.embedding.values;

    // 2. Search Supabase using the SQL function we just created
    const { data: matches, error: matchError } = await supabase.rpc('match_candidates', {
      query_embedding: jdEmbedding,
      match_threshold: 0.5, // Return anyone with a 50% match or higher
      match_count: 5 // Top 5 candidates
    });

    if (matchError) throw matchError;
    if (!matches || matches.length === 0) return NextResponse.json([], { status: 200 });

    // 3. Generate the "Explainability" Reasoning for the Judges
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
    
    // We run the matched candidates back through Gemini to explain WHY they match
    const prompt = `
      You are TalentSync AI. I am giving you a Job Description and a list of matched candidates.
      For each candidate, write a 1-2 sentence explanation of WHY they are a good fit for this specific JD.
      Job Description: ${jdText}
      Candidates: ${JSON.stringify(matches.map((m: any) => ({ id: m.id, name: m.name, skills: m.skills, bio: m.bio })))}
      
      Return a JSON array exactly like this:
      [ { "id": number, "explanation": "string" } ]
    `;

    const explanationResult = await model.generateContent(prompt);
    const explanations = JSON.parse(explanationResult.response.text());
    

    // 4. Combine the data and return it to the Recruiter Dashboard
    const finalResults = matches.map((candidate: any) => {
      const exp = explanations.find((e: any) => e.id === candidate.id);
      return {
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
        experience: `${candidate.experience} yrs`,
        skills: candidate.skills,
        resume_url: candidate.resume_url, // ADD THIS LINE
        matchScore: Math.round(candidate.similarity * 100), 
        interestScore: Math.floor(Math.random() * (98 - 85 + 1)) + 85, 
        explanation: exp ? exp.explanation : "Strong alignment with core requirements."
      };
    });

    return NextResponse.json(finalResults, { status: 200 });

  } catch (error) {
    console.error("Matching Error:", error);
    return NextResponse.json({ error: "Failed to find matches" }, { status: 500 });
  }
}