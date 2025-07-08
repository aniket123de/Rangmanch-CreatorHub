"use client"
import React, { useEffect, useState } from 'react'
import { Copy, Terminal, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface props{
  aiOutput:string;
}

function OutputSection({aiOutput}:props) {
  const [value, setValue] = useState<string>('Your result will appear here');
  const [copied, setCopied] = useState(false);

  // Function to parse RTF and extract readable text with formatting
  const parseRTF = (rtfText: string): string => {
    if (!rtfText) return 'Your result will appear here';
    
    // If it's not RTF format, return as is but try to format it
    if (!rtfText.includes('\\rtf1')) {
      return formatPlainText(rtfText);
    }
    
    // Remove RTF control codes and extract readable text
    let text = rtfText
      // Remove RTF header
      .replace(/\\rtf1[^}]*}/g, '')
      // Remove font table
      .replace(/\\fonttbl[^}]*}/g, '')
      // Remove color table
      .replace(/\\colortbl[^}]*}/g, '')
      // Remove viewkind and other format codes
      .replace(/\\viewkind\d+\\uc\d+\\pard[^\\]*/g, '\n')
      // Handle paragraph breaks
      .replace(/\\par\s*/g, '\n\n')
      // Handle line breaks
      .replace(/\\line\s*/g, '\n')
      // Handle bullets
      .replace(/\\bullet\s*/g, '• ')
      // Handle tabs (convert to spaces for better formatting)
      .replace(/\\tab\s*/g, '    ')
      // Remove font formatting but preserve structure
      .replace(/\\f\d+/g, '')
      .replace(/\\fs\d+/g, '')
      .replace(/\\b\d*/g, '') // bold
      .replace(/\\i\d*/g, '') // italic
      .replace(/\\ul\d*/g, '') // underline
      // Remove other formatting codes
      .replace(/\\[a-zA-Z]+\d*\s*/g, ' ')
      // Clean up braces
      .replace(/[{}]/g, '')
      .trim();
    
    return formatPlainText(text);
  };

  // Function to format plain text content
  const formatPlainText = (text: string): string => {
    return text
      // Handle bullet points marked with asterisk or bullet
      .replace(/\s*\*\s+/g, '\n• ')
      .replace(/\s*•\s*/g, '\n• ')
      // Format numbered lists with "d I.", "d II." pattern
      .replace(/\s*d\s+([IVX]+)\.\s*/g, '\n$1. ')
      // Format regular numbered lists
      .replace(/\s*(\d+\.)\s*/g, '\n$1 ')
      // Format Roman numerals
      .replace(/\s*([IVX]+\.)\s*/g, '\n$1 ')
      // Format lettered lists
      .replace(/\s*([a-z]\.)\s*/g, '\n$1 ')
      // Format "Outline:" patterns specifically
      .replace(/\s*\*\s*Outline:\s*/gi, '\n\nOutline:\n')
      // Format section titles that end with asterisks
      .replace(/\*\*([^*]+)\*\*/g, '\n\n$1\n')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Clean up multiple newlines but preserve intentional breaks
      .replace(/\n{3,}/g, '\n\n')
      // Clean up leading/trailing whitespace
      .trim();
  };

  useEffect(() => {
    if (aiOutput) {
      const parsedOutput = parseRTF(aiOutput);
      setValue(parsedOutput);
    }
  }, [aiOutput]);

  const handleCopy = async () => {
    try {
      const textToCopy = parseRTF(aiOutput) || value;
      await navigator.clipboard.writeText(textToCopy);
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
            <div className='bg-gray-900 rounded-lg border border-gray-700 min-h-[400px] p-4'>
              <div className='text-gray-300 text-sm leading-7 whitespace-pre-wrap overflow-auto max-h-[400px] font-sans'>
                {value.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  
                  // Handle different line types for better formatting
                  if (trimmedLine.startsWith('•')) {
                    return (
                      <div key={index} className='ml-4 mb-2 flex items-start'>
                        <span className='text-blue-400 mr-3 mt-1 text-base'>•</span>
                        <span className='flex-1 text-gray-300'>{trimmedLine.substring(1).trim()}</span>
                      </div>
                    );
                  } else if (trimmedLine.match(/^[IVX]+\./)) {
                    // Roman numerals
                    return (
                      <div key={index} className='ml-4 mb-2 flex items-start'>
                        <span className='text-purple-400 mr-3 font-semibold min-w-[2rem]'>
                          {trimmedLine.match(/^[IVX]+\./)?.[0]}
                        </span>
                        <span className='flex-1 text-gray-300'>{trimmedLine.replace(/^[IVX]+\.\s*/, '')}</span>
                      </div>
                    );
                  } else if (trimmedLine.match(/^\d+\./)) {
                    // Regular numbers
                    return (
                      <div key={index} className='ml-4 mb-2 flex items-start'>
                        <span className='text-green-400 mr-3 font-semibold min-w-[2rem]'>
                          {trimmedLine.match(/^\d+\./)?.[0]}
                        </span>
                        <span className='flex-1 text-gray-300'>{trimmedLine.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                    );
                  } else if (trimmedLine.match(/^[a-z]\./)) {
                    // Lettered lists
                    return (
                      <div key={index} className='ml-6 mb-1 flex items-start'>
                        <span className='text-cyan-400 mr-2 font-medium'>
                          {trimmedLine.match(/^[a-z]\./)?.[0]}
                        </span>
                        <span className='flex-1 text-gray-300'>{trimmedLine.replace(/^[a-z]\.\s*/, '')}</span>
                      </div>
                    );
                  } else if (trimmedLine === 'Outline:') {
                    // Special handling for standalone "Outline:" lines
                    return (
                      <div key={index} className='text-orange-400 font-semibold mb-3 mt-4 text-base'>
                        {trimmedLine}
                      </div>
                    );
                  } else if (trimmedLine.endsWith(':') && trimmedLine.length > 0 && trimmedLine.length < 30 && !trimmedLine.includes('*') && !trimmedLine.includes('the') && !trimmedLine.includes('and') && !trimmedLine.includes('of') && !trimmedLine.includes('in') && !trimmedLine.includes('to')) {
                    // Headers/Titles (but not lines with asterisks or common words that indicate sentences)
                    return (
                      <div key={index} className='text-yellow-400 font-semibold mb-2 mt-4 text-base'>
                        {trimmedLine}
                      </div>
                    );
                  } else if (trimmedLine === '') {
                    return <div key={index} className='h-2'></div>;
                  } else {
                    // Regular paragraphs - default gray text
                    return (
                      <div key={index} className='mb-3 text-gray-300 leading-6'>
                        {trimmedLine}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutputSection