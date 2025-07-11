export const AI_CONFIG = {
  // Default AI provider ('groq' or 'gemini')
  DEFAULT_PROVIDER: 'groq' as const,
  
  // Model configurations
  MODELS: {
    groq: {
      default: 'llama-3.3-70b-versatile',
      alternatives: [
        'llama-3.1-8b-instant',
        'gemma2-9b-it',
        'mistral-saba-24b'
      ]
    },
    gemini: {
      default: 'gemini-2.0-flash',
      alternatives: [
        'gemini-1.5-pro',
        'gemini-1.5-flash'
      ]
    }
  },
  
  // Generation parameters
  GENERATION_PARAMS: {
    temperature: 0.8,
    maxTokens: 4095,
    topP: 0.95,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1
  },
  
  // Content type specific settings
  CONTENT_SETTINGS: {
    'blog-content': {
      temperature: 0.7,
      maxTokens: 4096
    },
    'social-media': {
      temperature: 0.8,
      maxTokens: 2048
    },
    'youtube': {
      temperature: 0.8,
      maxTokens: 3072
    },
    'titles': {
      temperature: 0.9,
      maxTokens: 1024
    }
  } as Record<string, { temperature: number; maxTokens: number }>,
  
  // Fallback configuration
  FALLBACK: {
    enabled: true,
    retryAttempts: 2,
    retryDelay: 1000 // milliseconds
  }
};

export const getModelConfig = (contentType?: string) => {
  const baseConfig = AI_CONFIG.GENERATION_PARAMS;
  const specificConfig = contentType && contentType in AI_CONFIG.CONTENT_SETTINGS 
    ? AI_CONFIG.CONTENT_SETTINGS[contentType] 
    : {};
  
  return {
    ...baseConfig,
    ...specificConfig
  };
};

export const getPreferredModel = (provider: 'groq' | 'gemini' = AI_CONFIG.DEFAULT_PROVIDER) => {
  return AI_CONFIG.MODELS[provider].default;
};
