"use client"
import React, { useEffect, useState } from 'react'
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface props{
  aiOutput:string;
}

function OutputSectionFallback({aiOutput}:props) {
  const [value, setValue] = useState<string>('Your result will appear here');

  useEffect(() => {
    if (aiOutput) {
      setValue(aiOutput);
    }
  }, [aiOutput]);

  return (
    <div className='bg-white shadow-lg border rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='font-medium text-lg'>Your Result</h2>
        <Button className='flex gap-2'
        onClick={() => navigator.clipboard.writeText(aiOutput || value)}
        ><Copy className='w-4 h-4'/> Copy </Button>
      </div>
      <div className='p-5'>
        <textarea
          className='w-full min-h-[600px] p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your result will appear here"
        />
      </div>
    </div>
  )
}

export default OutputSectionFallback
