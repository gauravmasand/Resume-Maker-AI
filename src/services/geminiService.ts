import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

// This is a placeholder for the API key. In a real application,
// this would be handled by a secure environment variable solution.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. Using a mock service.");
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;


const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
        portfolio: { type: Type.STRING },
        summary: { type: Type.STRING },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    degree: { type: Type.STRING },
                    university: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    gpa: { type: Type.STRING }
                }
            }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    technologies: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        skills: {
            type: Type.OBJECT,
            properties: {
                languages: { type: Type.STRING },
                frameworks: { type: Type.STRING },
                developerTools: { type: Type.STRING },
                libraries: { type: Type.STRING }
            }
        }
    }
};

const mockParseResumeContent = async (base64Data: string, mimeType: string): Promise<ResumeData | null> => {
    console.log(`Mocking resume parse for file type: ${mimeType}`);
    await new Promise(res => setTimeout(res, 1500)); // Simulate network delay
    
    // In a real scenario, we might use a pre-defined example if the API key is missing
    const { initialResumeData } = await import('../constants');
    return initialResumeData;
};

export const parseResumeContent = async (base64Data: string, mimeType: string): Promise<ResumeData | null> => {
    if (!ai) return mockParseResumeContent(base64Data, mimeType);
    
    try {
        const filePart = {
            inlineData: {
                mimeType: mimeType,
                data: base64Data,
            },
        };

        const textPart = {
            text: `You are an expert resume parser. Analyze the provided resume document and extract the information into the specified JSON format. If a section (like 'projects') or a specific field is not present in the resume, omit the key or set its value to an empty string or an empty array as appropriate for the schema. For descriptions, split each bullet point into a separate string in the array.`,
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, filePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Add unique IDs to array items, as the AI won't generate them.
        // Also, ensure the properties exist before mapping, defaulting to an empty array.
        parsedJson.experience = (parsedJson.experience || []).map((exp: any) => ({...exp, id: uuidv4() }));
        parsedJson.education = (parsedJson.education || []).map((edu: any) => ({...edu, id: uuidv4() }));
        parsedJson.projects = (parsedJson.projects || []).map((proj: any) => ({...proj, id: uuidv4() }));
        
        // FIX: Ensure the skills object exists, even if the AI omits it, to prevent crashes.
        parsedJson.skills = parsedJson.skills || {
            languages: '',
            frameworks: '',
            developerTools: '',
            libraries: ''
        };
        
        return parsedJson as ResumeData;

    } catch (error) {
        console.error("Error parsing resume with Gemini:", error);
        return null;
    }
};

const mockQuantifyImpact = async (bulletPoint: string): Promise<string[]> => {
    console.log("Mocking impact quantification for:", bulletPoint);
    await new Promise(res => setTimeout(res, 1000));
    return [
        "Reduced latency by ___% (from Xms to Yms).",
        "Increased concurrent user capacity by ___.",
        "Improved Lighthouse performance score from ___ to ___."
    ];
};

export const quantifyImpact = async (bulletPoint: string): Promise<string[]> => {
    if (!ai) return mockQuantifyImpact(bulletPoint);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this resume bullet point: "${bulletPoint}". Generate 3 targeted, fill-in-the-blank style questions to help a software engineer quantify this achievement. The questions should elicit specific metrics.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.suggestions || [];
    } catch (error) {
        console.error("Error quantifying impact with Gemini:", error);
        return [];
    }
};


const mockAnalyzeJobDescription = async (resumeText: string, jdText: string): Promise<{ matchScore: number; analysis: string; }> => {
    console.log("Mocking JD analysis.");
    await new Promise(res => setTimeout(res, 2000));
    return {
        matchScore: 85,
        analysis: `
### Key Strengths:
*   Excellent alignment with **React, TypeScript, and Node.js**.
*   Strong project experience with **CI/CD and AWS**.

### Areas for Improvement:
1.  **Missing Keyword: 'GraphQL'**: The job description mentions GraphQL multiple times. Consider adding a project or a bullet point highlighting any experience with GraphQL APIs.
2.  **Enhance 'Scalability'**: While you mention performance, explicitly use the word "scalable" or "scalability" in your summary or experience section to better match the JD's focus on "building scalable systems."
3.  **Mention 'Agile'**: The JD specifies an Agile environment. Add a note about your experience working in Agile/Scrum teams to your summary or a role description.
`
    };
}


export const analyzeJobDescription = async (resumeText: string, jdText: string): Promise<{ matchScore: number; analysis: string; }> => {
    if (!ai) return mockAnalyzeJobDescription(resumeText, jdText);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a career coach for MAANG-level software engineers. Analyze the provided resume against the job description.
            
            --- RESUME ---
            ${resumeText}

            --- JOB DESCRIPTION ---
            ${jdText}
            
            --- TASK ---
            Return a JSON object with two keys: 
            1. 'matchScore': A number between 0 and 100 representing how well the resume matches the job description.
            2. 'analysis': A markdown-formatted string that includes a list of missing keywords and 2-3 specific, actionable suggestions for improving the resume to better match this job.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchScore: { type: Type.INTEGER },
                        analysis: { type: Type.STRING }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error analyzing job description with Gemini:", error);
        throw new Error("Failed to analyze job description.");
    }
};
