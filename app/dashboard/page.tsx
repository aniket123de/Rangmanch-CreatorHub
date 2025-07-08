"use client"
import React, { useState } from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'

function Dashboard() {
  const [userSearchInput,setUserSearchInput]=useState<string>()
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Search Section  */}
        <div className="mb-6 sm:mb-8">
          <SearchSection onSearchInput={(value:string)=>setUserSearchInput(value)} />
        </div>

        {/* Template List Section  */}
        <div className="w-full">
          <TemplateListSection userSearchInput={userSearchInput} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard