"use client"
import React, { useState } from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

interface PROPS {
    selectedTemplate?: TEMPLATE;
    userFormInput:any,
    loading:boolean
}

function FormSection({ selectedTemplate,userFormInput,loading }: PROPS) {

    const [formData,setFormData]=useState<any>();

    const handleInputChange=(event:any)=>{
        const {name,value}=event.target;
        setFormData({...formData,[name]:value})
    }

    const onSubmit=(e:any)=>{
        e.preventDefault();
        userFormInput(formData)
    }

    return (
        <div className='p-3 sm:p-4 md:p-5 shadow-md border rounded-lg bg-white'>
            {/* @ts-ignore */}
            <Image src={selectedTemplate?.icon}
                alt='icon' width={70} height={70} 
                className='w-12 h-12 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]' />
            <h2 className='font-bold text-lg sm:text-xl md:text-2xl mb-2 mt-4 text-primary'>{selectedTemplate?.name}</h2>
            <p className='text-gray-500 text-xs sm:text-sm'>{selectedTemplate?.desc}</p>

            <form className='mt-4 sm:mt-6' onSubmit={onSubmit}>
                {selectedTemplate?.form?.map((item, index) => (
                    <div key={index} className='my-2 flex flex-col gap-2 mb-4 sm:mb-6 md:mb-7'>
                        <label className='font-bold text-sm sm:text-base'>{item.label}</label>
                        {item.field == 'input' ?
                            <Input name={item.name} required={item?.required}
                            onChange={handleInputChange}
                            className='text-sm sm:text-base p-2 sm:p-3'
                            />
                            : item.field == 'textarea' ?
                            <>
                                <Textarea name={item.name} required={item?.required}
                                rows={3}
                                maxLength={2000}
                                onChange={handleInputChange}
                                className='text-sm sm:text-base p-2 sm:p-3 min-h-[80px] sm:min-h-[100px]' /> 
                                <label className='text-xs text-gray-400'>Note: Max 2000 Words</label>
                                
                                </>    : null
                        }
                    </div>
                ))}
                <Button type="submit" 
                className='w-full py-3 sm:py-4 md:py-6 text-sm sm:text-base font-medium'
                disabled={loading}
                >
                    {loading&&<Loader2Icon className='animate-spin mr-2'/>}
                    Generate Content</Button>
            </form>
        </div>
    )
}

export default FormSection