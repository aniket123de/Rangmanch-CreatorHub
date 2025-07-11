import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { chatSession } from '@/utils/AiModal';
import endent from 'endent';

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseURL: 'https://api.groq.com/openai/v1',
});

const enhancedSystemPrompt = endent`
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

export async function POST(req: NextRequest) {
  try {
    const { 
      prompt, 
      temperature = 0.7, 
      model = 'llama-3.3-70b-versatile',
      aiProvider = 'groq' // 'groq' or 'gemini'
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let content = '';
    let success = false;

    if (aiProvider === 'groq') {
      try {
        const { text } = await generateText({
          model: groq(model),
          system: enhancedSystemPrompt,
          prompt: prompt,
          temperature: temperature,
          maxTokens: 4096,
          topP: 0.95,
          frequencyPenalty: 0.1,
          presencePenalty: 0.1,
        });

        content = text;
        success = true;
      } catch (groqError) {
        console.warn('Groq failed, trying Gemini fallback:', groqError);
        
        // Fallback to Gemini
        try {
          const result = await chatSession.sendMessage(prompt);
          content = result?.response.text();
          success = true;
        } catch (geminiError) {
          throw new Error('Both AI services failed');
        }
      }
    } else {
      // Use Gemini first
      try {
        const result = await chatSession.sendMessage(prompt);
        content = result?.response.text();
        success = true;
      } catch (geminiError) {
        console.warn('Gemini failed, trying Groq fallback:', geminiError);
        
        // Fallback to Groq
        try {
          const { text } = await generateText({
            model: groq(model),
            system: enhancedSystemPrompt,
            prompt: prompt,
            temperature: temperature,
            maxTokens: 4096,
            topP: 0.95,
            frequencyPenalty: 0.1,
            presencePenalty: 0.1,
          });

          content = text;
          success = true;
        } catch (groqError) {
          throw new Error('Both AI services failed');
        }
      }
    }

    return NextResponse.json({
      content: content,
      success: success,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    
    let errorMessage = 'An error occurred while generating content.';
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a few moments.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API key configuration error. Please check your settings.';
      } else if (error.message.includes('503') || error.message.includes('overloaded')) {
        errorMessage = 'The AI service is currently overloaded. Please try again in a few moments.';
      } else if (error.message.includes('model') && error.message.includes('decommissioned')) {
        errorMessage = 'The AI model is no longer available. Please contact support.';
      } else if (error.message.includes('Both AI services failed')) {
        errorMessage = 'Both AI services are currently unavailable. Please try again later.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
