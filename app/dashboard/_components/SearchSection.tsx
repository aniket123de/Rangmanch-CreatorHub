"use client"
import { Search } from 'lucide-react'
import React from 'react'

function SearchSection({onSearchInput}:any) {
  return (
    <div className='p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-purple-500 via-purple-700 
    to-blue-600 flex flex-col justify-center items-center text-white'>
        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-2'>Browse All Templates</h2>
        <p className='text-sm sm:text-base text-center mb-4'>What would you like to create today?</p>
        <div className='w-full flex justify-center'>
            <div className='flex gap-2 items-center
             p-2 border rounded-md bg-white my-3 sm:my-5 w-full max-w-md sm:max-w-lg lg:w-[50%]'>
                <Search className='text-primary flex-shrink-0' />
                <input type="text" placeholder='Search'
                onChange={(event)=>onSearchInput(event.target.value)}
                className='bg-transparent w-full outline-none text-black text-sm sm:text-base'
                />
            </div>
        </div>
    </div>
  )
}

export default SearchSection