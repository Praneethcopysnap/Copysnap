'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingStepRoleTool from './OnboardingStepRoleTool';
import OnboardingStepIntent from './OnboardingStepIntent';
import OnboardingStepBrandVoice from './OnboardingStepBrandVoice';
import OnboardingStepCreateWorkspace from './OnboardingStepCreateWorkspace';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define the onboarding data structure
export interface OnboardingData {
  intent?: string;
  role?: string;
  tools?: string[];
  brandVoice?: {
    tone?: string[];
    style?: string[];
    customPrompt?: string;
  };
  firstWorkspace?: {
    name?: string;
    description?: string;
    type?: string;
  };
}

interface OnboardingWizardProps {
  userId?: string;
  onComplete?: (data: OnboardingData) => void;
}

const OnboardingWizard = ({ userId, onComplete }: OnboardingWizardProps = {}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for backward, 1 for forward
  const [onboardingData, setOnboardingData] = useState({
    intent: '',
    role: '',
    tools: [],
    brandVoice: {
      tone: [],
      style: [],
      customPrompt: '',
    },
    firstWorkspace: {
      name: '',
      description: '',
      type: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update onboarding data
  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      ...data,
    }));
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStep < 3) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete onboarding and mark as completed in database
      completeOnboarding();
    }
  };

  // Mark onboarding as complete in the database
  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        router.push('/login');
        return;
      }
      
      // Update the user's onboarding status
      const { error } = await supabase
        .from('users')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating onboarding status:', error);
      } else {
        console.log('Onboarding status updated successfully');
      }
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(onboardingData);
      } else {
        console.log('Onboarding completed', onboardingData);
      }
      
      // Redirect to dashboard with success notification
      router.push('/dashboard?onboarding=success');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Fallback - redirect to dashboard even if saving fails
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Steps configuration
  const steps = [
    {
      title: 'Your Intent',
      description: 'Tell us what brings you to CopySnap',
      component: (
        <OnboardingStepIntent
          data={onboardingData}
          updateData={updateData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      icon: '🎯'
    },
    {
      title: 'Your Role & Tools',
      description: 'Help us understand your workflow',
      component: (
        <OnboardingStepRoleTool
          data={onboardingData}
          updateData={updateData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      icon: '🛠️'
    },
    {
      title: 'Brand Voice',
      description: 'Define your preferred tone and style',
      component: (
        <OnboardingStepBrandVoice
          data={onboardingData}
          updateData={updateData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      icon: '🔊'
    },
    {
      title: 'Create Workspace',
      description: 'Set up your workspace to organize your content',
      component: (
        <OnboardingStepCreateWorkspace
          data={onboardingData}
          updateData={updateData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      icon: '🚀'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-blue-50/20 flex flex-col font-[inter]">
      {/* Header */}
      <motion.header 
        className="backdrop-blur-md bg-white/80 border-b border-gray-200/30 py-6 sticky top-0 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 md:px-8 max-w-full">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#005DFF] to-indigo-600 text-transparent bg-clip-text tracking-tight">CopySnap</h1>
            </motion.div>
            <div className="text-sm bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-gray-100/50 text-gray-600 font-medium">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Progress bar */}
      <div className="backdrop-blur-md bg-white/40">
        <div className="container mx-auto px-6 md:px-8 max-w-full">
          <div className="w-full bg-gray-100/40 h-2.5 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
            <motion.div 
              className="bg-gradient-to-r from-[#005DFF] to-indigo-500 h-full"
              initial={{ width: `${((currentStep) / steps.length) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Steps circles */}
      <div className="backdrop-blur-md bg-white/40 border-b border-gray-200/50 py-3">
        <div className="container mx-auto px-6 md:px-8 max-w-full">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <motion.div 
                  className={`relative rounded-full w-10 h-10 flex items-center justify-center 
                    ${
                      index === currentStep 
                        ? 'bg-gradient-to-br from-[#005DFF] to-indigo-600 text-white shadow-md' 
                        : index < currentStep 
                          ? 'bg-gradient-to-br from-green-100 to-emerald-50 text-green-600 border border-green-600/30' 
                          : 'bg-white text-gray-400 border border-gray-200 shadow-sm'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    scale: index === currentStep ? [1, 1.05, 1] : 1,
                    boxShadow: index === currentStep ? '0 0 15px rgba(0, 93, 255, 0.3)' : 'none' 
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: index === currentStep ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  {index < currentStep ? (
                    <motion.svg 
                      className="w-5 h-5" 
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path 
                        fill="currentColor" 
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                      />
                    </motion.svg>
                  ) : (
                    <span className="text-lg">
                      {step.icon}
                    </span>
                  )}
                  {index === currentStep && (
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-[#005DFF]"
                      animate={{ opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <motion.span 
                  className={`text-xs mt-1 font-medium hidden md:block ${
                    index === currentStep ? 'text-[#005DFF]' : 
                    index < currentStep ? 'text-green-600' : 'text-gray-400'
                  }`}
                  animate={{ 
                    y: index === currentStep ? [0, -2, 0] : 0 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: index === currentStep ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  {step.title}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow flex items-start justify-center pt-8 bg-gradient-to-b from-white/0 to-blue-50/20">
        <motion.div 
          className="backdrop-blur-md bg-white/80 w-full min-h-[50vh] rounded-t-2xl border-x border-t border-gray-200/30 shadow-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto max-w-full px-6 md:px-8 py-8 md:py-10">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? 60 : -60,
                    opacity: 0
                  }),
                  center: {
                    x: 0,
                    opacity: 1
                  },
                  exit: (direction: number) => ({
                    x: direction > 0 ? -60 : 60,
                    opacity: 0
                  })
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
                className="w-full max-w-full"
              >
                {currentStep < steps.length && (
                  <>
                    <div className="mb-8">
                      <motion.h2 
                        className="text-3xl font-bold text-gray-900 flex items-center tracking-tight"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="mr-4 text-3xl drop-shadow-md">{steps[currentStep]!.icon}</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">{steps[currentStep]!.title}</span>
                      </motion.h2>
                      <motion.p 
                        className="text-gray-600 text-lg mt-3 max-w-2xl"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {steps[currentStep]!.description}
                      </motion.p>
                    </div>
                    
                    <div className="w-full">
                      {steps[currentStep]!.component}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Loading overlay */}
          {isLoading && (
            <motion.div 
              className="absolute inset-0 backdrop-blur-lg bg-white/80 flex flex-col items-center justify-center rounded-t-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="w-24 h-24 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-full h-full" viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#005DFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    style={{ strokeDasharray: "100 100" }}
                  />
                </svg>
              </motion.div>
              <motion.p 
                className="mt-8 text-2xl text-gray-700 font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#005DFF] to-indigo-600"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.02, 1] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Setting up your experience...
              </motion.p>
              <motion.p
                className="text-gray-500 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Almost there!
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/70 py-6 border-t border-gray-200/30">
        <div className="container mx-auto px-6 md:px-8 max-w-full">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left text-sm text-gray-500">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#005DFF] to-indigo-600 font-medium">CopySnap</span> • Enhance your copywriting experience
            </div>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-gray-500 hover:text-[#005DFF] transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingWizard; 