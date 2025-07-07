"use client"
import React from 'react'

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

  return (
    <div className='bg-slate-100 min-h-screen'>
        <div>
        {children}
        </div>
    </div>
  )
}

export default layout