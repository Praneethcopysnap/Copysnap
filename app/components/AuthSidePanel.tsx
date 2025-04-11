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
    <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
      <div className="max-w-md p-8 flex flex-col items-center">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/logo.png"
            alt="CopySnap Logo"
            width={180}
            height={45}
            className="mb-2"
            priority
          />
        </motion.div>
        
        <div className="w-full relative">
          <motion.div 
            className="absolute -top-6 -left-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={[{ opacity: 1, scale: 1 }, floatingAnimation.animate]}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100"></div>
          </motion.div>
          <motion.div 
            className="absolute -bottom-6 -right-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={[{ opacity: 1, scale: 1 }, slowFloatingAnimation.animate]}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-12 h-12 rounded-full bg-primary"></div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.div 
                className="h-2 w-2 rounded-full bg-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              ></motion.div>
              <motion.div 
                className="h-2 w-2 rounded-full bg-yellow-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              ></motion.div>
              <motion.div 
                className="h-2 w-2 rounded-full bg-green-400"
                initial={{ opacity: 0 }}
                animate={pulseAnimation.animate}
                transition={{ duration: 0.3, delay: 0.8 }}
              ></motion.div>
              <motion.div 
                className="h-12 w-12 rounded-full bg-gray-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              ></motion.div>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                className="h-4 w-3/4 bg-gray-200 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              ></motion.div>
              <motion.div 
                className="h-4 w-full bg-gray-200 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              ></motion.div>
              <motion.div 
                className="h-4 w-1/2 bg-gray-200 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              ></motion.div>
            </div>
            
            <div className="mt-8 space-y-3">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <motion.div 
                  className="h-10 w-10 rounded-full bg-primary/20"
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  animate={pulseAnimation.animate}
                ></motion.div>
                <div className="flex-1">
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  <div className="mt-1 h-3 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <motion.div 
                  className="h-10 w-10 rounded-full bg-blue-100"
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                ></motion.div>
                <div className="flex-1">
                  <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                  <div className="mt-1 h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.p 
          className="text-center text-gray-600 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          Generate better UX copy for your product interfaces using real context from your designs.
        </motion.p>

        {/* Animated decorative elements */}
        <motion.div 
          className="absolute top-1/4 right-1/4 h-4 w-4 rounded-full bg-primary/30"
          initial={{ opacity: 0 }}
          animate={[
            { opacity: 0.7 },
            {
              ...pulseAnimation.animate,
              transition: { ...pulseAnimation.animate.transition, delay: 1 }
            }
          ]}
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/3 left-1/3 h-3 w-3 rounded-full bg-blue-300/50"
          initial={{ opacity: 0 }}
          animate={[
            { opacity: 0.5 },
            {
              ...pulseAnimation.animate,
              transition: { ...pulseAnimation.animate.transition, delay: 2 }
            }
          ]}
        ></motion.div>
      </div>
    </div>
  )
} 