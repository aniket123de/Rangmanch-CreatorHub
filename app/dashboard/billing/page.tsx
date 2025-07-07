"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { CheckCircle, Star } from 'lucide-react';

function billing() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h2 className='text-center font-bold text-3xl my-3'>Creator Hub Features</h2>
      <p className='text-center text-gray-600 mb-8'>All features are now available for free!</p>
 
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-200 p-6 shadow-lg sm:px-8 lg:p-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <h2 className="text-2xl font-bold text-gray-900 ml-2">
                Free Access
              </h2>
            </div>

            <p className="mt-2 sm:mt-4">
              <strong className="text-4xl font-bold text-indigo-700 sm:text-5xl">FREE</strong>
              <span className="text-lg font-medium text-gray-700 block mt-2">No subscription required</span>
            </p>
          </div>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">Unlimited AI Content Generation</span>
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">50+ Content Templates</span>
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">Unlimited Download & Copy</span>
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">Full History Access</span>
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">Advanced AI Models</span>
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">Export to Multiple Formats</span>
            </li>
          </ul>

          <div className="mt-8 text-center">
            <Button
              className='w-full rounded-full p-6 bg-indigo-600 hover:bg-indigo-700 text-white'
              disabled
            >
              ✨ Already Active - Enjoy Free Access!
            </Button>
            <p className="text-sm text-gray-600 mt-3">
              All features are included at no cost. Start creating amazing content now!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-900">AI-Powered</h4>
            <p className="text-sm text-gray-600 mt-1">Advanced AI models for high-quality content generation</p>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-900">Multiple Templates</h4>
            <p className="text-sm text-gray-600 mt-1">Blog posts, social media, ads, emails, and more</p>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-900">Easy to Use</h4>
            <p className="text-sm text-gray-600 mt-1">Simple interface designed for creators and marketers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default billing