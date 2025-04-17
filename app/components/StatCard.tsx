'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: JSX.Element;
  colorClass: string;
  infoTooltip?: string;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon, 
  colorClass,
  infoTooltip
}: StatCardProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="stat-card-2025 group overflow-hidden relative"
    >
      <div className="flex items-start">
        <div className={`${colorClass} rounded-full p-3 mr-4 relative z-10`}>
          {icon}
        </div>
        
        <div className="relative z-10">
          <div className="tooltip inline-block">
            <p className="text-sm font-medium text-gray-600">
              {title}
              {infoTooltip && (
                <span className="ml-1 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 inline-block"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </p>
            {infoTooltip && <span className="tooltip-text">{infoTooltip}</span>}
          </div>
          
          <div className="flex items-center">
            <motion.span 
              className="text-xl font-bold"
              variants={numberVariants}
            >
              {value}
            </motion.span>
            {change && (
              <span className={`ml-2 text-xs font-medium ${
                trend === 'up' 
                  ? 'text-green-500' 
                  : trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-gray-500'
              }`}>
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-opacity-5 -mr-6 -mt-6 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-opacity-5 -ml-4 -mb-4 bg-gradient-to-tr from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
    </motion.div>
  );
};

export default StatCard; 