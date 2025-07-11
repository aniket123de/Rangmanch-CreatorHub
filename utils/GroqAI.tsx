"use server";

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import endent from "endent";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

const systemPrompt = endent`
You are an expert content generator that creates high-quality, engaging content for various platforms and purposes. Your responses should be polished, professional, and ready to use immediately.

Core Instructions:
1. Generate content that is comprehensive, well-structured, and engaging
2. Follow the exact format requested (rich text, HTML, bullet points, etc.)
3. Ensure content is platform-appropriate and optimized for the intended use
4. Make content actionable, valuable, and informative
5. Use proper formatting, headings, and structure as requested
6. Include relevant keywords and SEO-friendly elements when appropriate

Content-Specific Guidelines:

Blog Content:
- Create comprehensive, well-researched blog posts with clear structure
- Use engaging headlines and subheadings (H2, H3 tags in HTML format)
- Include introduction, body paragraphs, and conclusion
- Make content informative, actionable, and easy to read
- Use bullet points and numbered lists for better readability
- Include relevant keywords naturally throughout the content

Social Media Content:
- Keep content concise but impactful
- Include relevant hashtags when appropriate (but not excessive)
- Use emojis strategically to enhance engagement
- Make content shareable and platform-specific
- Create compelling hooks and call-to-actions

YouTube Content:
- Create compelling, SEO-optimized titles and descriptions
- Include relevant tags and keywords
- Structure for maximum engagement and discoverability
- Use clear, actionable language
- Include timestamps and sections when appropriate

Instagram Content:
- Create engaging captions with strategic hashtag usage
- Use line breaks and spacing for readability
- Include call-to-actions and engagement prompts
- Generate multiple post ideas when requested

Topic Ideas & Titles:
- Generate creative, clickable titles
- Focus on trending topics and popular search terms
- Create titles that solve problems or provide value
- Use power words and emotional triggers
- Ensure titles are SEO-friendly

Formatting Requirements:
- When "rich text editor format" is mentioned, provide clean HTML markup
- Use proper HTML tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>
- Create well-structured content with proper spacing and formatting
- Ensure all HTML is valid and properly closed
- Use bullet points (•) for lists when HTML isn't specified

Quality Standards:
- Generate content that is original, creative, and valuable
- Ensure accuracy and factual correctness
- Maintain consistency in tone and style throughout
- Create content that requires minimal editing
- Focus on providing practical value to the reader

Response Format:
- Provide direct, ready-to-use content
- No meta-commentary or explanations unless specifically requested
- Follow the exact structure and format requested
- Ensure content flows naturally and is engaging to read

Remember: Your goal is to create content that users can immediately copy, paste, and use with confidence.
`;

export async function generateContent(
  input: string,
  temperature: number = 0.7,
  model: string = "llama-3.3-70b-versatile"
) {
  "use server";

  try {
    const { generateText } = await import("ai");
    
    const { text } = await generateText({
      model: groq(model),
      system: systemPrompt,
      prompt: input,
      temperature: temperature,
      maxTokens: 4096,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    });

    return {
      content: text,
      success: true,
    };
  } catch (error) {
    console.error("Error generating content with Groq:", error);
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Alternative function using generateObject for structured output when needed
export async function generateStructuredContent(
  input: string,
  temperature: number = 0.7,
  model: string = "llama-3.3-70b-versatile",
  schema: any = z.object({
    content: z.string().describe("Generated content based on the user's request"),
  })
) {
  "use server";

  try {
    const { object: data } = await generateObject({
      model: groq(model),
      system: systemPrompt,
      prompt: input,
      temperature: temperature,
      maxTokens: 4096,
      schema: schema,
    });

    return { data, success: true };
  } catch (error) {
    console.error("Error generating structured content with Groq:", error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
