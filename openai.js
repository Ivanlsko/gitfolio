import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

// Define Zod schema for the portfolio project response
const PortfolioProject = z.object({
    languagesUsed: z.array(z.string()),  // Array of languages used in the repo
    shortDescription: z.string(),  // Concise description of the code
    longDescription: z.string(),  // A more detailed description of the code
    keyFeatures: z.array(z.string()),  // List of key features or innovations in the code
    frameworks: z.array(z.string()).optional(),  // Frameworks used (optional)
    contributions: z.string().optional(),  // Highlight specific contributions
    lastUpdated: z.string().optional(),  // Optional date of the last update
});

export async function analyzeCode(codeText) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an expert software developer with deep knowledge of coding best practices and portfolio presentation. Your goal is to craft clear, concise, and compelling descriptions of code that highlight the developer's skills and achievements in a way that appeals to technical recruiters."
            },
            {
                role: "user",
                content: `Please analyze the following code and create a professional description for use in a developer's portfolio. Focus on summarizing what the code does, its purpose, key technical concepts, and any innovative or efficient approaches used. The code: ${codeText}`,
            },
        ],
        response_format: zodResponseFormat(PortfolioProject, "PortfolioProject"),
    });

    console.log(completion.choices[0].message);
}
