'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from './OnboardingWizard';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingStepIntentProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const INTENT_OPTIONS = [
  {
    id: 'website',
    label: 'Website Copy',
    description: 'Generate copy for landing pages, product descriptions, and website content.',
    icon: '🌐'
  },
  {
    id: 'marketing',
    label: 'Marketing Materials',
    description: 'Create copy for ads, emails, social media, and promotional campaigns.',
    icon: '📣'
  },
  {
    id: 'product',
    label: 'Product Design',
    description: 'Craft UX writing, interface copy, and in-app messaging.',
    icon: '⚙️'
  },
  {
    id: 'branding',
    label: 'Brand Messaging',
    description: 'Develop brand voice, taglines, and consistent messaging.',
    icon: '✨'
  },
  {
    id: 'documents',
    label: 'Documentation',
    description: 'Generate help articles, tutorials, and technical content.',
    icon: '📝'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Custom use case not listed above.',
    icon: '🔍'
  }
];

function OnboardingStepIntent({ data, updateData, onNext, onPrevious }: OnboardingStepIntentProps) {
  const [selectedIntent, setSelectedIntent] = useState(data.intent || '');
  const [customIntent, setCustomIntent] = useState('');
  const [error, setError] = useState('');

  const handleIntentSelect = (intent: string) => {
    setSelectedIntent(intent);
    setError('');
  };

  const handleNext = () => {
    if (!selectedIntent) {
      setError('Please select an intent to continue.');
      return;
    }

    const intentValue = selectedIntent === 'other' ? customIntent : selectedIntent;
    
    if (selectedIntent === 'other' && !customIntent.trim()) {
      setError('Please describe your custom intent.');
      return;
    }

    updateData({ intent: intentValue });
    onNext();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-xl font-medium text-gray-900">
          What are you primarily using CopySnap for?
        </h3>
        <p className="text-sm text-gray-600">
          This helps us tailor the experience to your specific needs.
        </p>
      </div>

      {/* Intent options in 2-column grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {INTENT_OPTIONS.map((option) => (
          <motion.div
            key={option.id}
            variants={item}
            whileHover={{ 
              scale: 1.03, 
              y: -5, 
              boxShadow: "0 20px 30px rgba(0, 93, 255, 0.07)",
            }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
              ${selectedIntent === option.id
                ? 'border-[#005DFF] bg-gradient-to-br from-blue-50/50 to-white shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 shadow-md hover:shadow-xl'
              }
            `}
            onClick={() => handleIntentSelect(option.id)}
          >
            {/* Highlight border animation */}
            {selectedIntent === option.id && (
              <motion.div 
                className="absolute inset-0 border-2 border-[#005DFF] rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            <div className="p-6 flex items-start">
              {/* Icon with glow effect */}
              <div className={`
                text-3xl mr-4 p-3 rounded-xl flex items-center justify-center
                ${selectedIntent === option.id
                  ? 'bg-blue-100/50 text-blue-600'
                  : 'bg-gray-100/80 text-gray-600'
                }
              `}>
                <motion.span
                  animate={selectedIntent === option.id ? { 
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ 
                    duration: 0.5,
                    repeat: selectedIntent === option.id ? 3 : 0,
                    repeatType: "reverse"
                  }}
                >
                  {option.icon}
                </motion.span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900">{option.label}</h4>
                <p className="text-gray-600 text-sm mt-1">{option.description}</p>
              </div>
              
              {/* Check mark animation */}
              {selectedIntent === option.id && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-4 right-4 bg-[#005DFF] text-white rounded-full p-1"
                >
                  <CheckCircle className="h-5 w-5" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Custom intent input with animation */}
      {selectedIntent === 'other' && (
        <motion.div 
          className="space-y-3 bg-white rounded-xl border border-gray-200 p-5 shadow-lg"
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <label htmlFor="custom-intent" className="block text-sm font-semibold text-gray-700">
            Please describe your use case
          </label>
          <textarea
            id="custom-intent"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#005DFF] focus:border-[#005DFF] transition-all shadow-inner bg-white"
            rows={3}
            placeholder="I&apos;m using CopySnap to..."
            value={customIntent}
            onChange={(e) => setCustomIntent(e.target.value)}
          />
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div 
          className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <motion.button
          type="button"
          className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          onClick={onNext}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Skip
        </motion.button>
        <motion.button
          type="button"
          className="px-6 py-2.5 text-sm font-medium text-white bg-[#005DFF] border border-transparent rounded-xl shadow-md hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-[#005DFF] transition-all flex items-center"
          onClick={handleNext}
          whileHover={{ 
            scale: 1.03, 
            y: -2,
            boxShadow: "0 10px 25px rgba(0, 93, 255, 0.3)" 
          }}
          whileTap={{ scale: 0.97 }}
        >
          Let&apos;s go <ArrowRight className="ml-2 h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

export default OnboardingStepIntent; 