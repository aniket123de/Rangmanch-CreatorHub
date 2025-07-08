import React from 'react'
import { TEMPLATE } from './TemplateListSection'
import Image from 'next/image'
import Link from 'next/link'

function TemplateCard(item:TEMPLATE) {
  return (
    <Link href={'/dashboard/content/'+item?.slug}>
      <div className='p-3 sm:p-4 lg:p-5 shadow-md rounded-md border bg-white 
      flex flex-col gap-2 sm:gap-3 cursor-pointer h-full hover:scale-105 transition-all'>
          <Image src={item.icon} alt='icon' 
          width={40} height={40} 
          className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12' />
          <h2 className='font-medium text-sm sm:text-base lg:text-lg'>{item.name}</h2>
          <p className='text-gray-500 line-clamp-3 text-xs sm:text-sm'>{item.desc}</p>
      </div>
    </Link>
  )
}

export default TemplateCard