"use client"
import React, { useEffect, useState } from 'react'
import { Copy, Terminal, CheckCircle, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface props{
  aiOutput:string;
}

function OutputSection({aiOutput}:props) {
  const [value, setValue] = useState<string>('Your result will appear here');
  const [copied, setCopied] = useState(false);
  const [enlarged, setEnlarged] = useState(false);

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

  // Improved parser for AI/RTF/Markdown output to clean HTML
  const blogStyleParser = (text: string): string => {
    if (!text) return '';
    let html = text;

    // Highlight important keywords
    const importantWords = [
      'Delhi', 'Paradise', 'Adventure', 'Must-See', 'Unforgettable', 'Unique', 'Experience', 'Tranquility', 'Vibrant', 'Breathtaking', 'Serene', 'Cultural', 'Scenery', 'Houseboats', 'Dal Lake', 'Gardens', 'Cuisine', 'Spiritual', 'Jewel', 'Floating', 'Mountains', 'Valleys', 'Lakes', 'Tulips', 'Spring', 'Winter', 'Snow', 'Warmth', 'Hospitality', 'Heritage', 'Tradition', 'Festival', 'Market', 'Handicraft', 'Shikara', 'Bloom', 'Colors', 'Temple', 'Shrine', 'Mosque', 'Skiing', 'Trekking', 'Paragliding', 'Nature', 'Beauty', 'Peace', 'Heaven', 'Heaven on Earth', 'Red Fort', 'Qutub Minar', 'Humayun', 'India Gate', 'Chandni Chowk', 'Jama Masjid', 'Spice Market', 'Rashtrapati Bhavan', 'Parliament House', 'Connaught Place', 'Lodhi Garden', 'Butter Chicken', 'Biryani', 'Kebabs', 'Street Food'
    ];
    importantWords.forEach(word => {
      const regex = new RegExp(`(\\b${word}\\b)`, 'gi');
      html = html.replace(regex, '<span class="text-sky-400 font-semibold">$1</span>');
    });

    // Remove RTF/markdown artifacts
    html = html.replace(/---+/g, ''); // Remove horizontal rules
    html = html.replace(/\\rtf1[\s\S]*?}/g, ''); // Remove RTF header
    html = html.replace(/\*\(Concluding Paragraph\)\*/gi, '<h2>Concluding Paragraph</h2>');
    html = html.replace(/\*\(Introductory Paragraph\)\*/gi, '<h2>Introductory Paragraph</h2>');
    html = html.replace(/\*\(Heading \d+: ([^*)]+)\)\*/g, '<h2>$1</h2>');
    html = html.replace(/\*Title: ([^*]+)\*/g, '<h2>$1</h2>');
    html = html.replace(/\*Must-See Historical Landmarks\)\*/gi, '<h2>Must-See Historical Landmarks</h2>');
    html = html.replace(/\*([A-Za-z0-9 ,\-:'()]+)\)\*/g, '<h2>$1</h2>');
    html = html.replace(/\*([A-Za-z0-9 ,\-:'()]+):\*/g, '<h3>$1</h3>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<b class="text-pink-400 font-bold">$1</b>');
    html = html.replace(/\*([^*]+)\*/g, '<i class="text-amber-300">$1</i>');
    html = html.replace(/_([^_]+)_/g, '<i class="text-amber-300">$1</i>');

    // Handle links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-sky-400 underline" target="_blank">$1</a>');

    // Add custom classes to headings for size, bold, and underline
    html = html.replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-2xl font-extrabold underline mb-4 mt-8">$1</h2>');
    html = html.replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-xl font-bold underline mb-3 mt-6">$1</h3>');

    // Split into lines for further processing
    const lines = html.split(/\r?\n/);
    let result = '';
    let inList = false;
    let inNumList = false;
    const formattingLabels = [
      /^bold:?$/i,
      /^italics:?$/i,
      /^underline:?$/i,
      /^hyperlink:?$/i,
      /^list:?$/i,
      /^numbered list:?$/i,
      /^heading \d:?$/i,
      /^heading:?$/i
    ];
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      // Skip formatting label lines
      if (formattingLabels.some(re => re.test(trimmed))) return;
      // Numbered list
      if (/^\d+\./.test(trimmed)) {
        if (!inNumList) {
          result += '<ol class="mb-6 mt-2 list-decimal list-inside">';
          inNumList = true;
        }
        result += `<li>${trimmed.replace(/^\d+\.\s*/, '')}</li>`;
      } else if (/^[•\-]\s?/.test(trimmed)) {
        // Bullet list
        if (!inList) {
          result += '<ul class="mb-6 mt-2 list-disc list-inside">';
          inList = true;
        }
        result += `<li>${trimmed.replace(/^[•\-]\s?/, '')}</li>`;
      } else if (trimmed.length === 0) {
        // Empty line: close lists if open
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        if (inNumList) {
          result += '</ol>';
          inNumList = false;
        }
      } else if (/<h2>|<h3>/.test(trimmed)) {
        // Heading: close lists if open
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        if (inNumList) {
          result += '</ol>';
          inNumList = false;
        }
        result += trimmed;
      } else {
        // Paragraph: close lists if open, then wrap in <p>
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        if (inNumList) {
          result += '</ol>';
          inNumList = false;
        }
        result += `<p class="mb-6">${trimmed}</p>`;
      }
    });
    if (inList) result += '</ul>';
    if (inNumList) result += '</ol>';
    // Remove empty <p></p>
    result = result.replace(/<p class="mb-6">\s*<\/p>/g, '');
    return result;
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
        <div className='bg-black rounded-lg border border-gray-700 overflow-hidden relative'>
          <div className='bg-gray-800 px-2 sm:px-4 py-2 border-b border-gray-700 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='font-mono text-xs text-gray-400'>output</span>
            </div>
            <button
              className="p-1 hover:bg-gray-700 rounded transition absolute right-2 top-2 sm:static"
              title="Enlarge"
              onClick={() => setEnlarged(true)}
            >
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className='p-2 sm:p-4'>
            <div className='bg-gray-900 rounded-lg border border-gray-700 min-h-[400px] p-4'>
              {/* Render HTML if output looks like HTML, else prettified text */}
              {aiOutput.trim().startsWith('<') ? (
                <div
                  className='prose prose-invert max-w-none text-gray-100 text-base leading-8 overflow-auto max-h-[400px] font-sans'
                  style={{paddingBottom: '0.5rem'}}
                  dangerouslySetInnerHTML={{ __html: aiOutput }}
                />
              ) : (
                <div
                  className='prose prose-invert max-w-none text-gray-100 text-base leading-8 overflow-auto max-h-[400px] font-sans'
                  style={{paddingBottom: '0.5rem'}}
                  dangerouslySetInnerHTML={{ __html: blogStyleParser(value) }}
                />
              )}
            </div>
          </div>
        </div>
        {/* Enlarged Modal Overlay */}
        {enlarged && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative w-full max-w-5xl h-[90vh] bg-gray-900 rounded-lg border border-gray-700 shadow-2xl flex flex-col">
              <button
                className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 z-10"
                title="Close"
                onClick={() => setEnlarged(false)}
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
              <div className="flex-1 overflow-auto p-8">
                {aiOutput.trim().startsWith('<') ? (
                  <div
                    className='prose prose-invert max-w-none text-gray-100 text-lg leading-8 font-sans'
                    dangerouslySetInnerHTML={{ __html: aiOutput }}
                  />
                ) : (
                  <div
                    className='prose prose-invert max-w-none text-gray-100 text-lg leading-8 font-sans'
                    dangerouslySetInnerHTML={{ __html: blogStyleParser(value) }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Add extra spacing between paragraphs
<style jsx>{`
  .prose p {
    margin-bottom: 1.5em;
  }
`}</style>

export default OutputSection