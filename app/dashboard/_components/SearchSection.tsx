"use client"
import { Search, Sparkles, Zap } from 'lucide-react'
import React, { useState } from 'react'

function SearchSection({onSearchInput}:any) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleInputChange = (value: string) => {
    setSearchValue(value)
    onSearchInput(value)
  }

  return (
    <div className='relative min-h-[280px] p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col justify-center items-center text-white overflow-hidden'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-pink-300/15 rounded-full blur-lg animate-ping"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-300/20 rounded-full blur-md animate-pulse delay-300"></div>
      </div>

      {/* Floating icons */}
      <div className="absolute top-8 left-8 animate-float">
        <Sparkles className="w-6 h-6 text-yellow-300/70" />
      </div>
      <div className="absolute top-12 right-12 animate-float-delayed">
        <Zap className="w-5 h-5 text-blue-300/70" />
      </div>
      <div className="absolute bottom-16 left-16 animate-float-slow">
        <Sparkles className="w-4 h-4 text-pink-300/70" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Title with gradient text */}
        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-3 bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent leading-tight'>
          Browse All Templates
        </h2>
        
        {/* Subtitle with better spacing */}
        <p className='text-base sm:text-lg lg:text-xl text-center mb-6 text-white/90 font-light max-w-2xl mx-auto leading-relaxed'>
          Discover amazing templates and bring your creativity to life
        </p>

        {/* Enhanced search container */}
        <div className='w-full flex justify-center mb-4'>
          <div className={`relative group transition-all duration-300 ease-out transform ${isFocused ? 'scale-105' : 'hover:scale-102'} w-full max-w-md sm:max-w-lg lg:max-w-2xl`}>
            {/* Glowing background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            
            {/* Search input container */}
            <div className={`relative flex gap-3 items-center p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl transition-all duration-300 ${isFocused ? 'bg-white shadow-3xl' : ''}`}>
              <Search className={`flex-shrink-0 transition-all duration-300 ${isFocused ? 'text-purple-600 w-6 h-6' : 'text-gray-500 w-5 h-5'}`} />
              <input 
                type="text" 
                placeholder='Search templates, themes, and more...'
                value={searchValue}
                onChange={(event) => handleInputChange(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className='bg-transparent w-full outline-none text-gray-800 text-base sm:text-lg placeholder-gray-500 font-medium'
              />
              {searchValue && (
                <button 
                  onClick={() => handleInputChange('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite 2s;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default SearchSection