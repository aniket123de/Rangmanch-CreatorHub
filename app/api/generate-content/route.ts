import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import endent from 'endent';

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseURL: 'https://api.groq.com/openai/v1',
});

const systemPrompt = endent`
You are an AI assistant tasked with generating high-quality content based on user inputs for different content types and platforms.

Instructions:

Analyze the User's Inputs:
  - Carefully review the provided form data and content requirements.
  - Understand the user's core focus, topic, and specific needs.
  - Consider the content type and platform-specific requirements.

Generate the Content:
  - Create content that is relevant, engaging, and well-structured.
  - Follow the specific format requested (rich text, HTML, bullet points, etc.).
  - Ensure the content is appropriate for the intended platform or use case.
  - Make the content actionable and valuable to the user.

Content-Specific Requirements:

Blog Content:
  - Create comprehensive, well-structured blog posts
  - Include proper headings, subheadings, and formatting
  - Make it engaging and informative
  - Use appropriate tone and style

Social Media Content:
  - Keep content concise and engaging
  - Include relevant hashtags when appropriate
  - Make it shareable and platform-appropriate
  - Use emojis when requested

YouTube Content:
  - Create compelling descriptions and titles
  - Include relevant tags and keywords
  - Make it SEO-friendly
  - Structure for maximum engagement

General Requirements:
  - Maintain high quality and accuracy
  - Adapt writing style to the content type
  - Provide comprehensive and useful content
  - Follow any specific formatting requirements mentioned
  - If rich text editor format is requested, provide properly formatted HTML

Additional Guidelines:
  - Be creative and original
  - Provide valuable insights and information
  - Maintain consistency in tone and style
  - Ensure content is ready to use without additional editing

The response should be direct content without any wrapper text or explanations unless specifically requested.
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, temperature = 0.7, model = 'llama-3.3-70b-versatile' } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Enhanced generation with better parameters for content creation
    const { text } = await generateText({
      model: groq(model),
      system: systemPrompt,
      prompt: prompt,
      temperature: temperature,
      maxTokens: 4096,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    });

    return NextResponse.json({
      content: text,
      success: true,
    });
  } catch (error) {
    console.error('Error generating content with Groq:', error);
    
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
