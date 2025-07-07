"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface props{
  aiOutput:string;
}

function OutputSection({aiOutput}:props) {
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
        <MDEditor
          value={value}
          onChange={(val?: string) => setValue(val || '')}
          height={600}
          preview="edit"
          hideToolbar={false}
          visibleDragbar={false}
        />
      </div>
    </div>
  )
}

export default OutputSection