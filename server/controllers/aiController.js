import Resume from "../models/resumeSchema.js";
import ai from "../config/ai.js";

// Enhance Resume professional summary
// POST : /api/ai/enhance-pro-summary
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Content is required" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlight key skills, experiences and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    // console.error("Error enhancing professional summary:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ENhance Resume Job Descriptions
// POST : /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Content is required" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    // console.error("Error enhancing job description:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Upload Resume and get analysis
// POST : /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, Title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";
    const userPrompt = `extract data from this resume: ${resumeText}

    Provide data in the following json format with no additional text before or after:
    {
    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],
    personalInfo: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean, default: false },
      },
    ],
    project: [
      {
        name: { type: String },
        type: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        graduation_date: { type: String },
        gpa: { type: String },
      },
    ],
  }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({
      userId,
      title: Title || "Untitled Resume",
      ...parsedData,
    });
    return res.json({ resumeId: newResume._id });
  } catch (error) {
    // console.error("Error uploading resume:", error);
    return res.status(500).json({ message: error.message });
  }
};
