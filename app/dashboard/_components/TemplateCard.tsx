import React from 'react'
import { TEMPLATE } from './TemplateListSection'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

function TemplateCard(item:TEMPLATE) {
  return (
    <Link href={'/dashboard/content/'+item?.slug} className="group block">
      <div className='relative p-6 shadow-md hover:shadow-xl rounded-2xl border border-gray-100 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50 
      flex flex-col gap-4 cursor-pointer h-full transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 overflow-hidden'>
        
        {/* Background gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        
        {/* Subtle animated background dots */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>
        
        {/* Icon container with enhanced styling */}
        <div className="relative z-10 flex items-center justify-between">
          <div className='w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-3 flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm'>
            <Image 
              src={item.icon} 
              alt={`${item.name} icon`} 
              width={24} 
              height={24} 
              className='w-6 h-6 transition-transform duration-300 group-hover:scale-110' 
            />
          </div>
          
          {/* Arrow indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
          </div>
        </div>
        
        {/* Content section with improved typography */}
        <div className="relative z-10 flex-1 space-y-3">
          {/* Title with enhanced styling */}
          <h2 className='font-bold text-lg text-gray-900 group-hover:text-gray-800 transition-colors duration-200 leading-tight'>
            {item.name}
          </h2>
          
          {/* Description with better hierarchy */}
          <p className='text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-200 font-medium'>
            {item.desc}
          </p>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500 ease-out rounded-b-2xl"></div>
        
        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-blue-200/50 transition-all duration-300"></div>
      </div>
    </Link>
  )
}

export default TemplateCard