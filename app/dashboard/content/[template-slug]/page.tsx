"use client"
import React, { useState } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { chatSession } from '@/utils/AiModal'

interface PROPS{
    params:{
        'template-slug':string
    }
}

function CreateNewContent(props:PROPS) {
   
    const selectedTemplate:TEMPLATE|undefined=Templates?.find((item)=>item.slug==props.params['template-slug']);
    const [loading,setLoading]=useState(false);
    const [aiOutput,setAiOutput]=useState<string>('');
    
    /**
     * Used to generate content from AI
     * @param formData 
     * @returns 
     */
    const GenerateAIContent=async(formData:any)=>{
        setLoading(true);
        const SelectedPrompt=selectedTemplate?.aiPrompt;
        const FinalAIPrompt=JSON.stringify(formData)+", "+SelectedPrompt;
        
        try {
            const result=await chatSession.sendMessage(FinalAIPrompt);
            setAiOutput(result?.response.text());
            
            // Show success message
            console.log('Content generated successfully!');
        } catch (error) {
            console.error('Error generating content:', error);
            setAiOutput('Sorry, there was an error generating content. Please try again.');
        }
        
        setLoading(false);
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
                <OutputSection aiOutput={aiOutput} />
            </div>
        </div>
    </div>
  )
}

export default CreateNewContent