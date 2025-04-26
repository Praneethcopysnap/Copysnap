'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from './OnboardingWizard';
import WorkspaceSidePanel from '@/app/components/WorkspaceSidePanel';

interface OnboardingStepCreateWorkspaceProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function OnboardingStepCreateWorkspace({ data, updateData, onNext, onPrevious }: OnboardingStepCreateWorkspaceProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWorkspaceSubmit = (workspaceData: {
    name: string;
    description: string;
    figma_link?: string;
    brand_voice_file?: string;
    tone?: string;
    style?: string;
    voice?: string;
    persona_description?: string;
  }) => {
    if (!workspaceData.name.trim()) {
      setError('Please enter a workspace name to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the onboarding data with workspace info
      updateData({
        firstWorkspace: {
          name: workspaceData.name,
          description: workspaceData.description,
          type: workspaceData.persona_description ? 'advanced' : 'basic'
        }
      });
      
      // Move to next step
      onNext();
    } catch (error) {
      console.error('Error creating workspace:', error);
      setError('There was a problem creating your workspace. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Just use the WorkspaceSidePanel directly */}
      <div className="bg-white rounded-md border border-gray-100">
        <WorkspaceSidePanel 
          isOpen={true} // Always open in onboarding context
          onClose={() => {}} // No-op since we don't want to close in onboarding
          onSubmit={handleWorkspaceSubmit}
          isSubmitting={isSubmitting}
          title="Create Your Workspace"
          embedded={true}
        />
      </div>
      
      {error && (
        <motion.div 
          className="text-red-500 text-xs p-2 bg-red-50 rounded-md border border-red-100"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <motion.button
          type="button"
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={onPrevious}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Back
        </motion.button>
      </div>
    </div>
  );
} 