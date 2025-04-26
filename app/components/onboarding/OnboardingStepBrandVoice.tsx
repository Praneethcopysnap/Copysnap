'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingData } from './OnboardingWizard';
import { CheckCircle, X, ArrowRight, Wand2 } from 'lucide-react';

interface OnboardingStepBrandVoiceProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const VOICE_TRAITS = [
  { id: 'friendly', label: 'Friendly', description: 'Warm, approachable, and conversational' },
  { id: 'professional', label: 'Professional', description: 'Formal, authoritative, and trustworthy' },
  { id: 'playful', label: 'Playful', description: 'Fun, entertaining, and light-hearted' },
  { id: 'innovative', label: 'Innovative', description: 'Forward-thinking, cutting-edge, and visionary' },
  { id: 'minimalist', label: 'Minimalist', description: 'Clean, concise, and straightforward' },
  { id: 'bold', label: 'Bold', description: 'Confident, daring, and impactful' },
  { id: 'luxurious', label: 'Luxurious', description: 'Premium, exclusive, and sophisticated' },
  { id: 'casual', label: 'Casual', description: 'Relaxed, natural, and down-to-earth' }
];

const TONE_SCALES = [
  { id: 'formal_casual', label: 'Formal vs. Casual', min: 'Formal', max: 'Casual' },
  { id: 'technical_simple', label: 'Technical vs. Simple', min: 'Technical', max: 'Simple' },
  { id: 'serious_humorous', label: 'Serious vs. Humorous', min: 'Serious', max: 'Humorous' },
  { id: 'traditional_modern', label: 'Traditional vs. Modern', min: 'Traditional', max: 'Modern' }
];

export default function OnboardingStepBrandVoice({ data, updateData, onNext, onPrevious }: OnboardingStepBrandVoiceProps) {
  const [selectedTraits, setSelectedTraits] = useState(data.brandVoice?.tone || []);
  const [toneScales, setToneScales] = useState({
    formal_casual: 50,
    technical_simple: 50,
    serious_humorous: 50,
    traditional_modern: 50
  });
  const [brandExample, setBrandExample] = useState(data.brandVoice?.customPrompt || '');
  const [error, setError] = useState('');
  const [activeScale, setActiveScale] = useState(null);
  const [mockUxCopy, setMockUxCopy] = useState('Welcome! We\'re excited to help you create amazing copy for your projects.');
  const [animateMock, setAnimateMock] = useState(false);
  
  useEffect(() => {
    // Update the mock UX copy based on slider values and selected traits
    const casual = toneScales.formal_casual > 70;
    const formal = toneScales.formal_casual < 30;
    const simple = toneScales.technical_simple > 70;
    const technical = toneScales.technical_simple < 30;
    const humorous = toneScales.serious_humorous > 70;
    const serious = toneScales.serious_humorous < 30;
    const modern = toneScales.traditional_modern > 70;
    
    // Check for selected traits
    const isFriendly = selectedTraits.includes('friendly');
    const isProfessional = selectedTraits.includes('professional');
    const isPlayful = selectedTraits.includes('playful');
    const isInnovative = selectedTraits.includes('innovative');
    const isMinimalist = selectedTraits.includes('minimalist');
    const isBold = selectedTraits.includes('bold');
    const isLuxurious = selectedTraits.includes('luxurious');
    const isCasual = selectedTraits.includes('casual');
    
    setAnimateMock(true);
    
    setTimeout(() => {
      let newCopy = '';
      
      // Generate different copy based on both traits and sliders
      if (isPlayful && humorous) {
        newCopy = 'Hey there! Ready to make some awesome copy? Just dive in and have fun with it! 🎉';
      } else if (isProfessional && formal && serious) {
        newCopy = 'Welcome to the CopySnap application. We provide enterprise-grade text generation tools to optimize your content workflow.';
      } else if (isFriendly && casual) {
        newCopy = 'Oh hi! Let\'s whip up some killer copy together. No pressure, it\'ll be fun!';
      } else if (isInnovative && modern) {
        newCopy = 'Welcome to the future of copywriting. CopySnap uses AI to transform how you create content.';
      } else if (isMinimalist && simple) {
        newCopy = 'Welcome. Create better copy in fewer steps.';
      } else if (isBold) {
        newCopy = 'STAND OUT WITH COPYSNAP. Make unforgettable content that demands attention.';
      } else if (isLuxurious) {
        newCopy = 'Experience the premium standard in copywriting. CopySnap delivers exceptional quality for discerning brands.';
      } else if (isCasual && humorous) {
        newCopy = 'Sup! Need some copy? We\'ve got you covered. No biggie!';
      } else if (formal && technical) {
        newCopy = 'Welcome to CopySnap. Our proprietary algorithms generate optimized content for your specified parameters.';
      } else if (casual && simple && humorous) {
        newCopy = 'Hey there! Ready to make some awesome copy? Just dive in and have fun with it!';
      } else if (selectedTraits.length > 0) {
        // Default copy when traits are selected but no specific combination matched
        newCopy = `Welcome to CopySnap. We&apos;ll help you create ${isFriendly ? 'friendly' : isProfessional ? 'professional' : isPlayful ? 'playful' : isBold ? 'bold' : 'excellent'} copy for your brand.`;
      } else {
        // Fallback when no traits are selected
        newCopy = 'Welcome to CopySnap. We\'re here to help you create the perfect copy for your projects.';
      }
      
      setMockUxCopy(newCopy);
      setAnimateMock(false);
    }, 300);
  }, [toneScales, selectedTraits]);
  
  const handleTraitToggle = (traitId: string) => {
    setSelectedTraits(prev => {
      if (prev.includes(traitId)) {
        return prev.filter(t => t !== traitId);
      } else {
        // Limit to max 3 traits
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, traitId];
      }
    });
    setError('');
  };
  
  const handleToneChange = (toneId: string, value: number) => {
    setToneScales(prev => ({
      ...prev,
      [toneId]: value
    }));
  };
  
  const handleNext = () => {
    if (selectedTraits.length === 0) {
      setError('Please select at least one voice trait to continue.');
      return;
    }
    
    updateData({
      brandVoice: {
        tone: selectedTraits,
        style: Object.entries(toneScales).map(([key, value]) => `${key}:${value}`),
        customPrompt: brandExample
      }
    });
    
    onNext();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  const sliderContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sliderItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Voice trait selection */}
      <div className="space-y-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Select up to 3 traits that define your brand voice
          </h3>
          <p className="text-sm text-gray-600">
            These traits will help us generate copy that matches your brand personality.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {VOICE_TRAITS.map((trait) => (
            <motion.div
              key={trait.id}
              variants={item}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 15px 30px rgba(0, 93, 255, 0.1)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                selectedTraits.includes(trait.id)
                  ? 'border-[#005DFF] bg-gradient-to-br from-blue-50/30 to-white shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 bg-white shadow-sm'
              }`}
              onClick={() => handleTraitToggle(trait.id)}
              layout
            >
              {selectedTraits.includes(trait.id) && (
                <motion.div 
                  className="absolute top-2 right-2 bg-[#005DFF] text-white rounded-full flex items-center justify-center p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <CheckCircle className="h-3 w-3" />
                </motion.div>
              )}
              
              <div className="font-medium text-lg leading-tight">{trait.label}</div>
              <div className="text-xs text-gray-600 mt-1">{trait.description}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Selected traits tags */}
        {selectedTraits.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 pt-2"
            initial="hidden"
            animate="show"
            variants={container}
          >
            {selectedTraits.map(traitId => {
              const trait = VOICE_TRAITS.find(t => t.id === traitId);
              return (
                <motion.div 
                  key={traitId}
                  className="bg-blue-50 border border-blue-200 text-[#005DFF] px-3 py-1.5 rounded-full flex items-center text-sm"
                  variants={{
                    hidden: { opacity: 0, y: 10, scale: 0.8 },
                    show: { opacity: 1, y: 0, scale: 1 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  <span>{trait?.label}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTraitToggle(traitId);
                    }}
                    className="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        
        {selectedTraits.length >= 3 && (
          <motion.div 
            className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex items-center text-amber-600 text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" }}
          >
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Maximum 3 traits selected. Deselect a trait to choose a different one.
          </motion.div>
        )}
      </div>

      {/* Tone scales */}
      <div className="space-y-5 p-5 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Fine-tune your brand&apos;s tone
            </h3>
            <motion.div 
              className="ml-3 p-1 bg-blue-50 rounded-full text-blue-600"
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Wand2 className="h-4 w-4" />
            </motion.div>
          </div>
          <p className="text-sm text-gray-600">
            Adjust these sliders to refine your brand&apos;s voice characteristics.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={sliderContainer}
          initial="hidden"
          animate="show"
        >
          {TONE_SCALES.map((scale) => (
            <motion.div 
              key={scale.id} 
              className="space-y-4 bg-gray-50 p-5 rounded-xl shadow-md"
              variants={sliderItem}
              onHoverStart={() => setActiveScale(scale.id)}
              onHoverEnd={() => setActiveScale(null)}
              whileHover={{ y: -4, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium text-sm">{scale.min}</span>
                <span className="text-[#005DFF] font-semibold">{scale.label}</span>
                <span className="text-gray-600 font-medium text-sm">{scale.max}</span>
              </div>
              <div className="relative h-12">
                <motion.input
                  type="range"
                  min="0"
                  max="100"
                  value={toneScales[scale.id]}
                  onChange={(e) => handleToneChange(scale.id, parseInt(e.target.value))}
                  className="w-full h-2 mt-4 rounded-lg appearance-none cursor-pointer accent-[#005DFF]"
                  style={{
                    background: `linear-gradient(to right, #E2E8F0 0%, #E2E8F0 100%)`,
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
                {/* Track fill visualization */}
                <motion.div 
                  className="absolute top-4 h-2 bg-[#005DFF] rounded-l-lg pointer-events-none"
                  style={{ width: `${toneScales[scale.id]}%` }}
                  animate={{ 
                    boxShadow: activeScale === scale.id ? '0 0 10px rgba(0, 93, 255, 0.5)' : 'none'
                  }}
                />
                {/* Slider thumb */}
                <motion.div 
                  className="absolute h-6 w-6 rounded-full bg-white border-2 border-[#005DFF] shadow-md"
                  style={{ 
                    left: `calc(${toneScales[scale.id]}% - 12px)`, 
                    top: '2px' 
                  }}
                  animate={{ 
                    scale: activeScale === scale.id ? 1.2 : 1,
                    boxShadow: activeScale === scale.id ? '0 0 0 8px rgba(0, 93, 255, 0.2)' : 'none'
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mock UX copy preview */}
        <div className="bg-white rounded-xl p-5 mt-6 border border-gray-200 shadow-inner">
          <div className="text-sm text-gray-500 mb-2 flex items-center">
            <span className="mr-2">Preview:</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs">User welcome message</span>
          </div>
          <AnimatePresence mode="wait">
            {animateMock ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="h-20 bg-gray-100 rounded-lg animate-pulse"
              />
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                {mockUxCopy}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Brand Voice Example - simplified for more compact UI */}
      <div className="space-y-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Brand voice example
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Provide an example of your ideal brand voice in action (optional).
          </p>
        </div>
        <motion.textarea
          id="brand-example"
          value={brandExample}
          onChange={(e) => setBrandExample(e.target.value)}
          placeholder="Enter a sample of your ideal brand voice..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-md focus:ring-2 focus:ring-[#005DFF] focus:border-[#005DFF] transition-all shadow-inner"
          rows={3}
          whileFocus={{ boxShadow: "0 0 0 3px rgba(0, 93, 255, 0.1)" }}
        />
      </div>

      {/* Error message */}
      {error && (
        <motion.div 
          className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <motion.button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 text-sm font-medium text-white bg-[#005DFF] border border-transparent rounded-xl shadow-md hover:shadow-xl transition-all flex items-center"
          whileHover={{ 
            scale: 1.03, 
            y: -2,
            boxShadow: "0 10px 25px rgba(0, 93, 255, 0.3)" 
          }}
          whileTap={{ scale: 0.97 }}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
} 