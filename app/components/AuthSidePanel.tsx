'use client';

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AuthSidePanel() {
  // Animation variants for the floating effect
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };
  
  const slowFloatingAnimation = {
    animate: {
      y: [0, -7, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  // Pulsing animation for UI elements
  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-blue-50 to-blue-100 flex-col justify-center items-center p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="relative w-full h-80">
            <Image
              src="/images/logo.png"
              alt="CopySnap Logo"
              width={300}
              height={300}
              className="p-6"
              priority
            />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Generate better UX copy for your product interfaces
        </h2>
        <p className="text-gray-600 mb-6">
          CopySnap helps you create context-aware UX copy using real context from your designs and brand guidelines.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 text-center">Context-aware generation</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 text-center">Brand voice consistency</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 text-center">Design integration</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-700 italic">
            "CopySnap has revolutionized our UX writing process, saving us countless hours and improving our product copy quality significantly."
          </p>
          <div className="mt-4 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <span className="text-xs font-semibold">JS</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Jane Smith</p>
              <p className="text-xs text-gray-500">Product Designer, Acme Inc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 