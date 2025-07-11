import { NextRequest, NextResponse } from 'next/server';
import { seedKnowledgeBase } from '@/utils/seedKnowledgeBase';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action !== 'seed') {
      return NextResponse.json(
        { error: 'Invalid action. Use "seed" to populate knowledge base.' },
        { status: 400 }
      );
    }

    const result = await seedKnowledgeBase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Knowledge base seeded successfully with ${result.addedChunks} chunks`,
        addedChunks: result.addedChunks
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to seed knowledge base' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error seeding knowledge base:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
