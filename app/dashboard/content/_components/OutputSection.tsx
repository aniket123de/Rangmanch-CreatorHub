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
      // Handle multiple bullet points in sequence (• • •)
      .replace(/\s*•\s*•\s*•/g, '\n•')
      .replace(/\s*•\s*•/g, '\n•')
      // Handle bullet points marked with asterisk or bullet
      .replace(/\s*\*\s+/g, '\n• ')
      .replace(/\s*•\s+/g, '\n• ')
      // Handle bullet points that start content without space after bullet
      .replace(/•([A-Z][^•]*?)(?=•|$)/g, '\n• $1')
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

    // Step 1: Clean up trailing patterns first
    html = html.replace(/\s*•\s*\*\s*$/gm, '');
    html = html.replace(/\s*\*\s*$/gm, '');
    
    // Remove specific unwanted emojis
    html = html.replace(/🇮🇳/g, '');
    
    // Step 2: Handle asterisk-wrapped content 
    html = html.replace(/\*([^*]+)\*/g, (match, content) => {
      if (/^[A-Z]/.test(content.trim()) || content.includes(':')) {
        return `\n• ${content.trim()}`;
      }
      return match;
    });

    // Step 3: Clean up multiple bullets
    html = html.replace(/•\s*•+/g, '•');
    html = html.replace(/^\s*•\s*$/gm, '');
    
    // Step 4: Fix parenthetical content and remove dots
    html = html.replace(/\s*\.\s*\(([^)]+)\)/g, ' <span class="text-amber-400 font-medium">($1)</span>');
    html = html.replace(/\s*•\s*\(([^)]+)\)/g, ' <span class="text-amber-400 font-medium">($1)</span>');
    html = html.replace(/\(([^)]+)\)/g, '<span class="text-amber-400 font-medium">($1)</span>');
    
    // Step 5: COMPREHENSIVE word fixing - one pass only
    const fixBrokenWords = (str: string): string => {
      return str
        // Fix specific common broken words first
        .replace(/\bIndi\s+a\b/gi, 'India')
        .replace(/\bDel\s+hi\b/gi, 'Delhi')
        .replace(/\bcit\s+y\b/gi, 'city')
        .replace(/\bcities\b/gi, 'cities')
        .replace(/\btempl?\w*\s+e?s\b/gi, 'temples')
        .replace(/\bghat\s+s\b/gi, 'ghats')
        .replace(/\bstreet\s+s\b/gi, 'streets')
        .replace(/\btradition\s+s\b/gi, 'traditions')
        .replace(/\bpro\s+s\b/gi, 'pros')
        .replace(/\bcon\s+s\b/gi, 'cons')
        .replace(/\bopinion\s+s\b/gi, 'opinions')
        .replace(/\bthought\s+s\b/gi, 'thoughts')
        .replace(/\bvlog\s+s\b/gi, 'vlogs')
        .replace(/\bhistor\s+y\b/gi, 'history')
        .replace(/\bcultur\s+e\b/gi, 'culture')
        .replace(/\barchitectur\s+e\b/gi, 'architecture')
        .replace(/\blandmark\s+s\b/gi, 'landmarks')
        .replace(/\bmonument\s+s\b/gi, 'monuments')
        .replace(/\bmuseum\s+s\b/gi, 'museums')
        .replace(/\bmarket\s+s\b/gi, 'markets')
        .replace(/\brestaurant\s+s\b/gi, 'restaurants')
        .replace(/\btempl\s+e\b/gi, 'temple')
        .replace(/\bpalac\s+e\b/gi, 'palace')
        .replace(/\bfort\s+s\b/gi, 'forts')
        .replace(/\bgarden\s+s\b/gi, 'gardens')
        .replace(/\bpark\s+s\b/gi, 'parks')
        
        // Advanced pattern matching for broken words with conditional logic
        .replace(/\b([a-zA-Z]{2,})\s+([a-z]{1,3})\b/g, (match, firstPart, secondPart) => {
          // Don't merge if it's clearly two separate words
          const commonWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'to', 'of', 'in', 'on', 'at', 'for', 'by', 'as', 'if', 'or', 'so', 'no', 'up', 'my', 'we', 'me', 'he', 'go', 'do', 'it'];
          if (commonWords.includes(secondPart.toLowerCase())) return match;
          
          // Don't merge if first part ends with vowel and second part starts with vowel (likely separate words)
          if (/[aeiou]$/i.test(firstPart) && /^[aeiou]/i.test(secondPart)) return match;
          
          // Don't merge if it would create a word longer than 15 characters (likely separate words)
          if (firstPart.length + secondPart.length > 15) return match;
          
          // Common suffixes that should be merged
          const commonSuffixes = ['s', 'es', 'ed', 'ing', 'ly', 'er', 'est', 'al', 'ic', 'ty', 'cy', 'ry', 'ny', 'my'];
          if (commonSuffixes.includes(secondPart.toLowerCase())) {
            return firstPart + secondPart;
          }
          
          // Check if merging creates a sensible word (basic heuristics)
          const merged = firstPart + secondPart;
          
          // If merged word has common patterns, it's likely correct
          if (/tion$|sion$|ment$|ness$|able$|ible$|ical$|ular$/i.test(merged)) {
            return merged;
          }
          
          // If first part is 4+ chars and second part is 1-2 chars, likely a suffix
          if (firstPart.length >= 4 && secondPart.length <= 2) {
            return merged;
          }
          
          // Otherwise keep separate
          return match;
        })
        
        // Fix broken suffixes with more comprehensive logic
        .replace(/\b(\w{4,})\s+(s|es|ed|ing|ly|er|est|al|ic|ty|ry|ny)\b/g, (match, word, suffix) => {
          // Don't merge if word already ends with the suffix
          if (word.toLowerCase().endsWith(suffix.toLowerCase())) return match;
          
          // Don't merge if it would create obvious mistakes
          if (suffix === 's' && word.endsWith('s')) return match;
          if (suffix === 'es' && word.endsWith('es')) return match;
          if (suffix === 'ed' && word.endsWith('ed')) return match;
          
          // Special cases for common words
          if (word.toLowerCase() === 'cit' && suffix === 'y') return 'city';
          if (word.toLowerCase() === 'histor' && suffix === 'y') return 'history';
          if (word.toLowerCase() === 'cultur' && suffix === 'e') return 'culture';
          
          return word + suffix;
        })
        
        // Fix broken compound words and common patterns
        .replace(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g, (match, first, second) => {
          // Common compound locations/names that should stay together
          const compounds = [
            'Red Fort', 'India Gate', 'Qutub Minar', 'Lotus Temple', 'Jama Masjid',
            'Chandni Chowk', 'Connaught Place', 'New Delhi', 'Old Delhi'
          ];
          
          const combined = first + ' ' + second;
          if (compounds.includes(combined)) return combined;
          
          // If both parts are short (2-4 chars), might be a broken word
          if (first.length <= 4 && second.length <= 4) {
            return first + second.toLowerCase();
          }
          
          return match;
        })
        
        // Clean up excessive spaces but preserve intentional spacing
        .replace(/\s{3,}/g, ' ')  // Replace 3+ spaces with single space
        .replace(/([a-zA-Z])\s{2,}([a-zA-Z])/g, '$1 $2')  // Fix double spaces between letters
        .replace(/\s+([.!?,:;])/g, '$1')  // Remove spaces before punctuation
        .replace(/([.!?])\s{2,}/g, '$1 ')  // Single space after punctuation
        .trim();
    };
    
    // Apply word fixing
    html = fixBrokenWords(html);

    // Remove RTF/markdown artifacts
    html = html.replace(/---+/g, ''); // Remove horizontal rules
    html = html.replace(/\\rtf1[\s\S]*?}/g, ''); // Remove RTF header
    
    // Enhanced formatting for headings and sections with modern styling - EXTRA BOLD AND BIGGER
    html = html.replace(/\*\(Concluding Paragraph\)\*/gi, '<h2 class="text-6xl font-black text-cyan-400 mb-10 mt-16 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent border-l-8 border-cyan-400 pl-8 py-6 shadow-2xl tracking-wide">🎯 Concluding Paragraph</h2>');
    html = html.replace(/\*\(Introductory Paragraph\)\*/gi, '<h2 class="text-6xl font-black text-cyan-400 mb-10 mt-16 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent border-l-8 border-cyan-400 pl-8 py-6 shadow-2xl tracking-wide">📝 Introductory Paragraph</h2>');
    html = html.replace(/\*\(Heading \d+: ([^*)]+)\)\*/g, '<h2 class="text-6xl font-black mb-10 mt-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent border-l-8 border-purple-400 pl-8 py-6 shadow-2xl tracking-wide">🔥 $1</h2>');
    html = html.replace(/\*Title: ([^*]+)\*/g, '<h1 class="text-8xl font-black mb-12 mt-10 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent text-center border-b-8 border-yellow-400 pb-8 shadow-2xl tracking-wider">✨ $1</h1>');
    html = html.replace(/\*Must-See Historical Landmarks\)\*/gi, '<h2 class="text-6xl font-black mb-10 mt-16 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent border-l-8 border-emerald-400 pl-8 py-6 shadow-2xl tracking-wide">🏛️ Must-See Historical Landmarks</h2>');
    html = html.replace(/\*([A-Za-z0-9 ,\-:'()]+)\)\*/g, '<h2 class="text-6xl font-black mb-10 mt-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent border-l-8 border-purple-400 pl-8 py-6 shadow-2xl tracking-wide">🔥 $1</h2>');
    html = html.replace(/\*([A-Za-z0-9 ,\-:'()]+):\*/g, '<h3 class="text-4xl font-black mb-8 mt-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent border-l-6 border-green-400 pl-6 py-4 shadow-xl tracking-wide">⚡ $1</h3>');
    
    // Modern enhanced bold formatting with gradient backgrounds
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-yellow-200 font-extrabold bg-gradient-to-r from-yellow-600 to-orange-600 px-3 py-1 rounded-full shadow-lg text-sm">$1</strong>');
    html = html.replace(/\*([^*\n•]+)\*/g, '<strong class="text-pink-200 font-bold bg-gradient-to-r from-pink-600 to-rose-600 px-2 py-1 rounded shadow">$1</strong>');
    
    // Enhanced italic formatting with subtle styling
    html = html.replace(/_([^_]+)_/g, '<em class="text-amber-300 italic font-medium bg-amber-900/20 px-1 rounded">$1</em>');
    
    // Modern format common patterns with improved badges
    html = html.replace(/\b(Note|Important|Warning|Tips?|Remember):/gi, '<span class="inline-flex items-center gap-1 text-red-200 font-bold bg-gradient-to-r from-red-600 to-red-700 px-3 py-1 rounded-full text-sm shadow-lg">⚠️ $1:</span>');
    html = html.replace(/\b(Benefits?|Advantages?|Pros?):/gi, '<span class="inline-flex items-center gap-1 text-green-200 font-bold bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1 rounded-full text-sm shadow-lg">✅ $1:</span>');
    html = html.replace(/\b(Features?|Highlights?):/gi, '<span class="inline-flex items-center gap-1 text-blue-200 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 rounded-full text-sm shadow-lg">🌟 $1:</span>');
    html = html.replace(/\b(Outline?):/gi, '<span class="inline-flex items-center gap-1 text-purple-200 font-bold bg-gradient-to-r from-purple-600 to-violet-600 px-3 py-1 rounded-full text-sm shadow-lg">📝 $1:</span>');

    // Modern custom classes for headings with enhanced styling
    html = html.replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-4xl font-black mb-8 mt-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent text-center border-b-4 border-yellow-400 pb-4 shadow-lg">$1</h1>');
    html = html.replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-2xl font-extrabold mb-6 mt-10 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent border-l-4 border-cyan-400 pl-4 py-2 shadow-md">$1</h2>');
    html = html.replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-xl font-bold mb-4 mt-8 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent border-l-2 border-green-400 pl-3 py-1">$1</h3>');

    // Enhanced modern link styling with hover effects
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="inline-flex items-center gap-1 text-blue-300 font-semibold bg-blue-900/30 px-2 py-1 rounded hover:bg-blue-800/50 transition-all duration-200 border border-blue-500/30 hover:border-blue-400" target="_blank">🔗 $1</a>');

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
    
    // Additional cleanup before processing lines - simplified
    const cleanedLines = lines.map(line => {
      return line
        .replace(/\s*•\s*\*\s*$/, '') // Remove trailing • *
        .replace(/\s*\*\s*$/, '') // Remove trailing *
        .replace(/\s*\.\s*\(([^)]+)\)/g, ' ($1)') // Remove dots before parentheses
        .replace(/\s+/g, ' ') // Single space normalization
        .trim();
    });
    cleanedLines.forEach((line, idx) => {
      const trimmed = line.trim();
      // Skip formatting label lines and empty lines
      if (formattingLabels.some(re => re.test(trimmed)) || trimmed.length === 0) {
        // Empty line: close lists if open
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        if (inNumList) {
          result += '</ol>';
          inNumList = false;
        }
        return;
      }
      
      // Enhanced numbered list with modern card-like styling
      if (/^\d+\./.test(trimmed)) {
        if (!inNumList) {
          result += '<ol class="mb-8 mt-6 space-y-4 ml-0">';
          inNumList = true;
        }
        const content = trimmed.replace(/^\d+\.\s*/, '');
        const numberMatch = trimmed.match(/^\d+/);
        const number = numberMatch ? numberMatch[0] : '1';
        result += `<li class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 font-medium flex items-start gap-4 hover:bg-gray-800/70 transition-colors">
          <span class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-lg">${number}</span>
          <span class="text-gray-100 leading-relaxed pt-1">${content}</span>
        </li>`;
      } else if (/^[•\-*]\s/.test(trimmed)) {
        // Enhanced bullet list with modern card styling and better icons
        if (!inList) {
          result += '<ul class="mb-8 mt-6 space-y-3 ml-0">';
          inList = true;
        }
        // Clean up the content by removing trailing • * patterns
        let content = trimmed.replace(/^[•\-*]\s/, '');
        content = content.replace(/\s*•\s*\*\s*$/, ''); // Remove trailing • *
        content = content.replace(/\s*\*\s*$/, ''); // Remove trailing *
        
        // Enhanced content formatting within bullets
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-yellow-200 font-bold bg-yellow-600/20 px-1 rounded">$1</strong>');
        content = content.replace(/\*([^*]+)\*/g, '<strong class="text-pink-300 font-semibold">$1</strong>');
        
        result += `<li class="bg-gray-800/30 border-l-4 border-blue-400/50 rounded-r-lg p-4 flex items-start gap-3 hover:bg-gray-800/50 hover:border-blue-400 transition-all duration-200">
          <span class="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mt-0.5">
            <span class="text-white text-xs font-bold">●</span>
          </span>
          <span class="text-gray-100 leading-relaxed font-medium">${content}</span>
        </li>`;
      } else if (/<h[1-3]>/.test(trimmed)) {
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
        // Paragraph: close lists if open, then wrap in <p> with enhanced formatting
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        if (inNumList) {
          result += '</ol>';
          inNumList = false;
        }
        
        // Enhanced paragraph formatting with modern styling
        let enhancedContent = trimmed;
        enhancedContent = enhancedContent.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-yellow-200 font-bold bg-gradient-to-r from-yellow-600/30 to-orange-600/30 px-2 py-1 rounded shadow">$1</strong>');
        enhancedContent = enhancedContent.replace(/\*([^*]+)\*/g, '<strong class="text-pink-300 font-semibold bg-pink-600/20 px-1 rounded">$1</strong>');
        enhancedContent = enhancedContent.replace(/\b([A-Z][A-Za-z\s]*:)/g, '<span class="text-green-300 font-bold bg-green-600/20 px-2 py-1 rounded">$1</span>');
        
        result += `<p class="mb-8 text-gray-100 leading-relaxed font-medium text-base bg-gray-800/20 border border-gray-700/30 rounded-lg p-4 shadow-sm hover:bg-gray-800/30 transition-colors">${enhancedContent}</p>`;
      }
    });
    if (inList) result += '</ul>';
    if (inNumList) result += '</ol>';
    
    // Final cleanup - very conservative to avoid breaking emojis
    result = result
      .replace(/<p class="mb-6[^"]*">\s*<\/p>/g, '') // Remove empty paragraphs
      .replace(/\s{2,}/g, ' ') // Normalize spaces but preserve emojis
      .trim();
      
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