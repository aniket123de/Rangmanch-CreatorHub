"use server";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import endent from "endent";
import { getRagStore } from "./SimpleRAGStore";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

const ragSystemPrompt = endent`
You are an expert content generator with access to a comprehensive knowledge base. Your responses should be polished, professional, and ready to use immediately.

Core Instructions:
1. First, analyze any provided knowledge context for relevance to the user's request
2. Use the knowledge context to enhance and inform your response when relevant
3. Generate content that is comprehensive, well-structured, and engaging
4. Follow the exact format requested (rich text, HTML, bullet points, etc.)
5. Ensure content is platform-appropriate and optimized for the intended use
6. Make content actionable, valuable, and informative
7. Use proper formatting, headings, and structure as requested
8. Include relevant keywords and SEO-friendly elements when appropriate

Knowledge Integration Guidelines:
- When relevant knowledge context is provided, incorporate it naturally into your response
- Cite or reference specific information from the knowledge base when appropriate
- If the knowledge context doesn't match the user's query, generate original content
- Combine your general knowledge with the specific context provided
- Ensure the final content flows naturally and doesn't feel disconnected

Content-Specific Guidelines:

Blog Content:
- Create comprehensive, well-researched blog posts with clear structure
- Use engaging headlines and subheadings (H2, H3 tags in HTML format)
- Include introduction, body paragraphs, and conclusion
- Make content informative, actionable, and easy to read
- Use bullet points and numbered lists for better readability
- Include relevant keywords naturally throughout the content
- Incorporate insights from the knowledge base when relevant

Social Media Content:
- Keep content concise but impactful
- Include relevant hashtags when appropriate (but not excessive)
- Use emojis strategically to enhance engagement
- Make content shareable and platform-specific
- Create compelling hooks and call-to-actions
- Use knowledge base insights to add credibility and depth

YouTube Content:
- Create compelling, SEO-optimized titles and descriptions
- Include relevant tags and keywords
- Structure for maximum engagement and discoverability
- Use clear, actionable language
- Include timestamps and sections when appropriate
- Leverage knowledge base content for comprehensive coverage

Instagram Content:
- Create engaging captions with strategic hashtag usage
- Use line breaks and spacing for readability
- Include call-to-actions and engagement prompts
- Generate multiple post ideas when requested
- Use knowledge insights to create authoritative content

Topic Ideas & Titles:
- Generate creative, clickable titles
- Focus on trending topics and popular search terms
- Create titles that solve problems or provide value
- Use power words and emotional triggers
- Ensure titles are SEO-friendly
- Incorporate knowledge base insights for unique angles

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
- Use knowledge base information to enhance credibility and depth

Response Format:
- Provide direct, ready-to-use content
- No meta-commentary or explanations unless specifically requested
- Follow the exact structure and format requested
- Ensure content flows naturally and is engaging to read
- When using knowledge base information, integrate it seamlessly

Remember: Your goal is to create content that users can immediately copy, paste, and use with confidence, enhanced by the specific knowledge and insights from the provided context.
`;

export async function generateRAGContent(
  input: string,
  temperature: number = 0.7,
  model: string = "llama-3.3-70b-versatile",
  enableRAG: boolean = true
) {
  "use server";

  try {
    let knowledgeContext = "";
    
    if (enableRAG) {
      try {
        const ragStore = await getRagStore();
        knowledgeContext = await ragStore.getKnowledgeContext(input);
      } catch (error) {
        console.warn("RAG context retrieval failed, proceeding without context:", error);
      }
    }
    
    // Construct the enhanced prompt with knowledge context
    const enhancedPrompt = knowledgeContext 
      ? `${knowledgeContext}\n\nUser Request: ${input}`
      : input;
    
    const { text } = await generateText({
      model: groq(model),
      system: ragSystemPrompt,
      prompt: enhancedPrompt,
      temperature: temperature,
      maxTokens: 4096,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    });

    return {
      content: text,
      success: true,
      usedRAG: enableRAG && knowledgeContext.length > 0,
      contextLength: knowledgeContext.length,
    };
  } catch (error) {
    console.error("Error generating RAG content with Groq:", error);
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      usedRAG: false,
      contextLength: 0,
    };
  }
}

export async function generateRAGContentWithFallback(
  input: string,
  temperature: number = 0.7,
  model: string = "llama-3.3-70b-versatile",
  enableRAG: boolean = true
) {
  "use server";

  try {
    // First try with RAG-enhanced Groq
    const result = await generateRAGContent(input, temperature, model, enableRAG);
    
    if (result.success) {
      return result;
    }
    
    // Fallback to regular Groq without RAG
    console.log("RAG generation failed, falling back to regular Groq");
    const fallbackResult = await generateRAGContent(input, temperature, model, false);
    
    if (fallbackResult.success) {
      return {
        ...fallbackResult,
        fallbackUsed: true,
        fallbackReason: "RAG generation failed",
      };
    }
    
    // If both fail, try the legacy Gemini system
    console.log("Groq generation failed, falling back to Gemini");
    const { chatSession } = await import("./AiModal");
    const geminiResult = await chatSession.sendMessage(input);
    
    return {
      content: geminiResult.response?.text() || "",
      success: true,
      error: null,
      usedRAG: false,
      contextLength: 0,
      fallbackUsed: true,
      fallbackReason: "Groq generation failed, used Gemini",
    };
    
  } catch (error) {
    console.error("Error in RAG content generation with fallback:", error);
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      usedRAG: false,
      contextLength: 0,
      fallbackUsed: false,
    };
  }
}

// Function to get RAG store statistics
export async function getRAGStats() {
  "use server";
  
  try {
    const ragStore = await getRagStore();
    return ragStore.getStats();
  } catch (error) {
    console.error("Error getting RAG stats:", error);
    return {
      totalChunks: 0,
      indexInitialized: false,
      config: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Function to add knowledge to RAG store
export async function addKnowledgeToRAG(documents: Array<{
  content: string;
  metadata: {
    source: string;
    type: 'document' | 'faq' | 'guideline' | 'example' | 'reference';
    title?: string;
    tags?: string[];
  };
}>) {
  "use server";
  
  try {
    const ragStore = await getRagStore();
    return await ragStore.addDocuments(documents);
  } catch (error) {
    console.error("Error adding knowledge to RAG:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      addedChunks: 0,
    };
  }
}
