"use client"
import React, { useState } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PROPS{
    params:{
        'template-slug':string
    }
}

function CreateNewContent(props:PROPS) {
   
    const selectedTemplate:TEMPLATE|undefined=Templates?.find((item)=>item.slug==props.params['template-slug']);
    const [loading,setLoading]=useState(false);
    const [aiOutput,setAiOutput]=useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [lastFormData, setLastFormData] = useState<any>(null);
    
    /**
     * Used to generate content from AI
     * @param formData 
     * @returns 
     */
    const GenerateAIContent=async(formData:any)=>{
        setLoading(true);
        setError(null);
        setLastFormData(formData);
        const SelectedPrompt=selectedTemplate?.aiPrompt;
        const FinalAIPrompt=JSON.stringify(formData)+", "+SelectedPrompt;
        
        try {
            // Try RAG-enhanced generation first
            const response = await fetch('/api/generate-content-rag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: {
                        ...formData,
                        templatePrompt: SelectedPrompt,
                        templateType: selectedTemplate?.name || 'Content'
                    },
                    enableRAG: true
                }),
            });

            const result = await response.json();
            
            if (result.success && result.content) {
                setAiOutput(result.content);
                setError(null);
                console.log('Content generated successfully!', {
                    usedRAG: result.metadata?.usedRAG,
                    contextLength: result.metadata?.contextLength,
                    fallbackUsed: result.metadata?.fallbackUsed
                });
            } else {
                throw new Error(result.error || 'Failed to generate content');
            }
        } catch (error: any) {
            console.error('Error generating content:', error);
            
            // Fallback to hybrid API if RAG fails
            try {
                console.log('Falling back to hybrid API...');
                const fallbackResponse = await fetch('/api/generate-content-hybrid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: FinalAIPrompt,
                        temperature: 0.8,
                        model: 'llama-3.3-70b-versatile',
                        aiProvider: 'groq'
                    }),
                });

                const fallbackResult = await fallbackResponse.json();
                
                if (fallbackResult.success && fallbackResult.content) {
                    setAiOutput(fallbackResult.content);
                    setError(null);
                    console.log('Content generated successfully with fallback!');
                } else {
                    throw new Error(fallbackResult.error || 'Fallback generation failed');
                }
            } catch (fallbackError: any) {
                console.error('Both generation methods failed:', fallbackError);
                
                // Check for specific error types
                if (error?.message?.includes('503') || error?.message?.includes('overloaded')) {
                    setError('The AI service is currently overloaded. Please try again in a few moments.');
                } else if (error?.message?.includes('rate limit')) {
                    setError('Rate limit exceeded. Please try again in a few moments.');
                } else if (error?.message?.includes('API key')) {
                    setError('AI service configuration error. Please check the API key.');
                } else if (error?.message?.includes('fetch')) {
                    setError('Network error. Please check your connection and try again.');
                } else if (error?.message?.includes('Both AI services')) {
                    setError('Both AI services are currently unavailable. Please try again later.');
                } else {
                    setError(error?.message || 'Sorry, there was an error generating content. Please try again.');
                }
                setAiOutput('');
            }
        }
        
        setLoading(false);
    }

    const handleRetry = () => {
        if (lastFormData) {
            GenerateAIContent(lastFormData);
        }
    }

  return (
    <div className='p-3 sm:p-4 md:p-5'>
        <Link href={"/dashboard"}>
            <Button className='mb-4 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2'> 
                <ArrowLeft className='w-4 h-4 mr-2'/> Back
            </Button>
        </Link>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 py-3 sm:py-4 md:py-5'>
            {/* FormSection  */}
            <div className='lg:col-span-1'>
                <FormSection 
                selectedTemplate={selectedTemplate}
                userFormInput={(v:any)=>GenerateAIContent(v)}
                loading={loading} />
            </div>
            {/* OutputSection  */}
            <div className='lg:col-span-2'>
                {error && (
                  <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    <div>{error}</div>
                    <Button className="mt-2" onClick={handleRetry} disabled={loading}>
                      Retry
                    </Button>
                  </div>
                )}
                <OutputSection aiOutput={aiOutput} />
            </div>
        </div>
    </div>
  )
}

export default CreateNewContent