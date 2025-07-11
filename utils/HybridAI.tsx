import { generateContent as generateGroqContent } from './GroqAI';
import { chatSession } from './AiModal';

export async function generateContentWithFallback(
  input: string,
  temperature: number = 0.7,
  preferredModel: 'groq' | 'gemini' = 'groq'
) {
  if (preferredModel === 'groq') {
    try {
      const result = await generateGroqContent(input, temperature);
      if (result.success) {
        return result;
      }
      console.warn('Groq failed, falling back to Gemini:', result.error);
    } catch (error) {
      console.warn('Groq failed, falling back to Gemini:', error);
    }
    
    // Fallback to Gemini
    try {
      const result = await chatSession.sendMessage(input);
      return {
        content: result?.response.text(),
        success: true,
      };
    } catch (error) {
      return {
        content: "",
        success: false,
        error: error instanceof Error ? error.message : "Both AI services failed",
      };
    }
  } else {
    // Try Gemini first
    try {
      const result = await chatSession.sendMessage(input);
      return {
        content: result?.response.text(),
        success: true,
      };
    } catch (error) {
      console.warn('Gemini failed, falling back to Groq:', error);
      
      // Fallback to Groq
      try {
        const result = await generateGroqContent(input, temperature);
        return result;
      } catch (fallbackError) {
        return {
          content: "",
          success: false,
          error: fallbackError instanceof Error ? fallbackError.message : "Both AI services failed",
        };
      }
    }
  }
}
