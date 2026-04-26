import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // --- NEW: UPLOAD FILE TO SUPABASE STORAGE ---
    // Create a unique file name so we don't overwrite people with the same name
    const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    const { data: storageData, error: storageError } = await supabase.storage
      .from('resumes')
      .upload(uniqueFileName, file, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (storageError) {
      console.error("Storage Error:", storageError);
      throw new Error("Failed to upload PDF to storage");
    }

    // Get the public URL for the uploaded PDF
    const { data: publicUrlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(uniqueFileName);
      
    const publicPdfUrl = publicUrlData.publicUrl;
    // ---------------------------------------------

    // 1. Parse Resume with Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are an expert technical recruiter AI named TalentSync AI.
      Read the attached resume and extract the candidate's core information.
      You MUST return the data in this exact JSON schema:
      {
        "name": "Full Name",
        "role": "Inferred current or desired job title",
        "experience": number,
        "skills": ["Skill 1", "Skill 2", "Skill 3"],
        "bio": "Write a punchy, professional 2-sentence summary."
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    const parsedData = JSON.parse(result.response.text());

    // 2. Generate Vector Embedding
    const textToEmbed = `${parsedData.role}. ${parsedData.bio} Skills: ${parsedData.skills.join(", ")}`;
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embeddingResult = await embeddingModel.embedContent(textToEmbed);
    const embedding = embeddingResult.embedding.values;

    // 3. Save to Supabase (Now including the resume_url!)
    const { error: dbError } = await supabase
      .from('candidates')
      .insert({
        name: parsedData.name,
        role: parsedData.role,
        experience: Math.round(Number(parsedData.experience)) || 0,
        skills: parsedData.skills,
        bio: parsedData.bio,
        embedding: embedding,
        resume_url: publicPdfUrl // SAVE THE LINK HERE
      });

    if (dbError) {
      console.error("Supabase Insert Error:", dbError);
      throw new Error("Failed to save to database");
    }

    return NextResponse.json(parsedData, { status: 200 });

  } catch (error) {
    console.error("Pipeline Error:", error);
    return NextResponse.json(
      { error: "Failed to process candidate application" },
      { status: 500 }
    );
  }
}