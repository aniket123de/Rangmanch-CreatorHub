"use client"
import React from 'react'
import DashboardHeader from '@/components/DashboardHeader'

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

  return (
    <div className='bg-slate-100 min-h-screen'>
        <DashboardHeader />
        <div>
        {children}
        </div>
    </div>
  )
}

export default layout