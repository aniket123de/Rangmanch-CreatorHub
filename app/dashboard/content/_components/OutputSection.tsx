"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { Copy, Terminal, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface props{
  aiOutput:string;
}

function OutputSection({aiOutput}:props) {
  const [value, setValue] = useState<string>('Your result will appear here');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (aiOutput) {
      setValue(aiOutput);
    }
  }, [aiOutput]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiOutput || value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='bg-gray-900 shadow-2xl border border-gray-700 rounded-lg overflow-hidden'>
      {/* Terminal Header */}
      <div className='bg-gray-800 border-b border-gray-700 p-2 sm:p-4'>
        <div className='flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0'>
          <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
            <div className='flex gap-1 sm:gap-2'>
              <div className='w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full'></div>
              <div className='w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full'></div>
              <div className='w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full'></div>
            </div>
            <div className='flex items-center gap-2 text-gray-300'>
              <Terminal className='w-3 h-3 sm:w-4 sm:h-4' />
              <span className='font-mono text-xs sm:text-sm'>AI Output Terminal</span>
            </div>
          </div>
          <Button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start ${
              copied 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className='w-3 h-3 sm:w-4 sm:h-4' />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className='w-3 h-3 sm:w-4 sm:h-4' />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className='bg-gray-900 p-2 sm:p-4 md:p-6'>
        <div className='bg-black rounded-lg border border-gray-700 overflow-hidden'>
          <div className='bg-gray-800 px-2 sm:px-4 py-2 border-b border-gray-700'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='font-mono text-xs text-gray-400'>output.md</span>
            </div>
          </div>
          <div className='p-2 sm:p-4'>
            <MDEditor
              value={value}
              onChange={(val?: string) => setValue(val || '')}
              height={400}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              data-color-mode="dark"
              className="!bg-black !border-none"
              textareaProps={{
                placeholder: 'Your AI-generated content will appear here...',
                style: {
                  fontSize: '12px',
                  lineHeight: '1.6',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  backgroundColor: '#000000',
                  color: '#e5e7eb',
                  border: 'none',
                  outline: 'none',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutputSection