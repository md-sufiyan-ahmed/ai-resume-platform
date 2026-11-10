
require("dotenv").config();

const { ResumeSchema } = require("./resumeSchema");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env");
}

async function analyzeResume(resumeText) {
    const { GoogleGenAI, Type } = await import("@google/genai");

    const ai = new GoogleGenAI({
        apiKey: apiKey
    });

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",

        contents: `
Analyze the following resume and extract its information.

Return:
- name
- email
- phone
- education
- skills
- projects
- experience

If information is missing, use an empty string or empty array.

Resume:
${resumeText}
`,

        config: {
            responseMimeType: "application/json",

            responseSchema: {
                type: Type.OBJECT,

                properties: {
                    name: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },

                    education: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                degree: { type: Type.STRING },
                                institution: { type: Type.STRING },
                                field: { type: Type.STRING },
                                graduationYear: { type: Type.STRING }
                            },
                            required: [
                                "degree",
                                "institution",
                                "field",
                                "graduationYear"
                            ]
                        }
                    },

                    skills: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },

                    projects: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING },
                                technologies: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                }
                            },
                            required: [
                                "name",
                                "description",
                                "technologies"
                            ]
                        }
                    },

                    experience: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                company: { type: Type.STRING },
                                role: { type: Type.STRING },
                                duration: { type: Type.STRING }
                            },
                            required: [
                                "company",
                                "role",
                                "duration"
                            ]
                        }
                    }
                },

                required: [
                    "name",
                    "email",
                    "phone",
                    "education",
                    "skills",
                    "projects",
                    "experience"
                ]
            }
        }
    });

    const parsedResume = JSON.parse(response.text);

    const validation = ResumeSchema.safeParse(parsedResume);

    if (!validation.success) {
        throw new Error(
            `Resume validation failed: ${validation.error.message}`
        );
    }

    return validation.data;
}

module.exports = {
    analyzeResume
};
