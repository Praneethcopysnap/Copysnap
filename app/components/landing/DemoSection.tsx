'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiCheck, FiCopy, FiRefreshCw } from 'react-icons/fi';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

// Types that might be needed from the parent or defined locally/globally
type ToastType = 'success' | 'error';
interface Frame {
  id: string;
  name: string;
}

// Define props for the DemoSection component
interface DemoSectionProps {
  demoRef: any;
  waitlistRef: any;
  mockFrames: Frame[];
  selectedFrame: string;
  setSelectedFrame: (id: string) => void;
  generatedCopy: string[];
  isGenerating: boolean;
  handleRegenerate: () => void;
  scrollToRef: (ref: any) => void;
  // Component props
  AnimatedButton: any;
  LoadingSpinner: any;
  GeneratedResults: any;
}

const DemoSection = ({
    demoRef,
    waitlistRef,
    mockFrames,
    selectedFrame,
    setSelectedFrame,
    generatedCopy,
    isGenerating,
    handleRegenerate,
    scrollToRef,
    // Destructure passed components
    AnimatedButton,
    LoadingSpinner,
    GeneratedResults
}: DemoSectionProps) => {

  const renderFrames = mockFrames.map((frame: Frame) => (
      <button
        key={frame.id}
        onClick={() => setSelectedFrame(frame.id)}
        className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center justify-between text-sm ${
          selectedFrame === frame.id
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {frame.name}
        {selectedFrame === frame.id && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
      </button>
  ));

  return (
      <section id="demo" ref={demoRef} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">See it in action</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Select a Figma frame, generate contextual copy, and sync it back with one click.
        </p>

        {/* Demo Widget */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="md:flex">
            {/* Left Panel: Frame Selection */}
            <div className="md:w-1/3 p-6 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <FiLayers className="mr-2 text-blue-500"/> Select Figma Frame
              </h3>
              <div className="space-y-2">
                 {renderFrames}
              </div>
            </div>

            {/* Right Panel: Copy Generation */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                      <Sparkles className="mr-2 text-yellow-500"/> Generated Copy
                  </h3>
                 <AnimatedButton
                    onClick={handleRegenerate} // Use regenerate handler
                    className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                      isGenerating
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    disabled={isGenerating || !selectedFrame}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                     <> <FiRefreshCw className="mr-1" size={14}/> Regenerate </>
                    )}
                  </AnimatedButton>
              </div>

              {isGenerating ? (
                <LoadingSpinner />
              ) : (
                <GeneratedResults currentCopy={generatedCopy} />
              )}

              <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Select a suggestion to copy it.</p>
              </div>

            </div>
          </div>
        </div>
         {/* CTA Button Below Demo */}
         <div className="text-center mt-12">
           <AnimatedButton
              onClick={() => scrollToRef(waitlistRef)}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center mx-auto"
           >
              Join the Waitlist <ArrowRight className="ml-2" size={20} />
           </AnimatedButton>
          </div>
      </div>
    </section>
  );
};

DemoSection.displayName = 'DemoSection';

export default DemoSection; 