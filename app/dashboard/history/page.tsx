
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { TEMPLATE } from '../_components/TemplateListSection'

export interface HISTORY{
    id:Number,
    formData:string,
    aiResponse:string,
    templateSlug:string,
    createdBy:string,
    createdAt:string
}

function History() {
    
    // Mock data for demonstration - in a real app, this would come from local storage or another source
    const mockHistoryList: HISTORY[] = [
        {
            id: 1,
            formData: '{"topic": "AI Technology"}',
            aiResponse: 'AI technology is revolutionizing the way we work and live. It offers unprecedented opportunities for automation, data analysis, and intelligent decision-making across various industries.',
            templateSlug: 'blog-title',
            createdBy: 'demo@example.com',
            createdAt: '15/01/2024'
        },
        {
            id: 2,
            formData: '{"product": "Smart Watch"}',
            aiResponse: 'Introducing the next generation of wearable technology that seamlessly integrates with your daily routine.',
            templateSlug: 'instagram-post',
            createdBy: 'demo@example.com',
            createdAt: '14/01/2024'
        }
    ];

    const GetTemplateName=(slug:string)=>{
        const template:TEMPLATE|any=Templates?.find((item)=>item.slug==slug)
        return template;
    }
    
  return (
    <div className='m-5 p-5 border rounded-lg bg-white'>
        <h2 className='font-bold text-3xl'>History</h2>
        <p className='text-gray-500'>View sample AI generated content (Demo Mode)</p>
        <div className='grid grid-cols-7 font-bold bg-secondary mt-5 py-3 px-3'>
            <h2 className='col-span-2'>TEMPLATE</h2>
            <h2 className='col-span-2'>AI RESP</h2>
            <h2>DATE</h2>
            <h2>WORDS</h2>
            <h2>COPY</h2>
        </div>
        {mockHistoryList.map((item:HISTORY,index:number)=>(
            <div key={index}>
                <div className='grid grid-cols-7 my-5 py-3 px-3'>
                    <h2 className='col-span-2 flex gap-2 items-center'>
                        <Image src={GetTemplateName(item?.templateSlug)?.icon} width={25} height={25} alt='icon' />
                        {GetTemplateName(item.templateSlug)?.name}
                    </h2>
                    <h2 className='col-span-2 line-clamp-3 mr-3'>{item?.aiResponse}</h2>
                    <h2>{item.createdAt}</h2>
                    <h2>{item?.aiResponse.length}</h2>
                    <h2>
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(item.aiResponse)}
                        >
                            Copy
                        </Button>
                    </h2>
                </div>
                <hr/>
            </div>
        ))}
    </div>
  )
}

export default History