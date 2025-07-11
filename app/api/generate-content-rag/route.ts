import { NextRequest, NextResponse } from 'next/server';
import { generateRAGContentWithFallback } from '@/utils/RAGEnhancedAI';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputs, enableRAG = true } = body;
    
    if (!inputs || Object.keys(inputs).length === 0) {
      return NextResponse.json(
        { error: 'No input data provided' },
        { status: 400 }
      );
    }

    // Construct the prompt from the form inputs
    const prompt = constructPrompt(inputs);

    // Generate content with RAG enhancement
    const result = await generateRAGContentWithFallback(
      prompt,
      0.7, // temperature
      "llama-3.3-70b-versatile", // model
      enableRAG
    );

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Failed to generate content',
          details: {
            usedRAG: result.usedRAG,
            fallbackUsed: (result as any).fallbackUsed || false,
            fallbackReason: (result as any).fallbackReason || null,
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: result.content,
      success: true,
      metadata: {
        usedRAG: result.usedRAG,
        contextLength: result.contextLength,
        fallbackUsed: (result as any).fallbackUsed || false,
        fallbackReason: (result as any).fallbackReason || null,
        model: 'llama-3.3-70b-versatile',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error in RAG content generation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function constructPrompt(inputs: Record<string, any>): string {
  const parts: string[] = [];
  
  // Add each input field to the prompt
  Object.entries(inputs).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim()) {
      // Convert camelCase to readable format
      const readableKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      parts.push(`${readableKey}: ${value.trim()}`);
    }
  });
  
  return parts.join('\n');
}
