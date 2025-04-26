'use client';

import React, { useState } from 'react';
import { OnboardingData } from './OnboardingWizard';

interface OnboardingStepRoleToolProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ROLE_OPTIONS = [
  { id: 'ux-designer', label: 'UX Designer' },
  { id: 'ui-designer', label: 'UI Designer' },
  { id: 'product-designer', label: 'Product Designer' },
  { id: 'content-designer', label: 'Content Designer' },
  { id: 'ux-writer', label: 'UX Writer' },
  { id: 'product-manager', label: 'Product Manager' },
  { id: 'copywriter', label: 'Copywriter' },
  { id: 'marketing', label: 'Marketing Professional' },
  { id: 'developer', label: 'Developer' },
  { id: 'other', label: 'Other' }
];

const TOOL_OPTIONS = [
  { id: 'figma', label: 'Figma' },
  { id: 'sketch', label: 'Sketch' },
  { id: 'adobe-xd', label: 'Adobe XD' },
  { id: 'adobe-ps', label: 'Adobe Photoshop' },
  { id: 'framer', label: 'Framer' },
  { id: 'webflow', label: 'Webflow' },
  { id: 'other', label: 'Other' }
];

export default function OnboardingStepRoleTool({ data, updateData, onNext, onPrevious }: OnboardingStepRoleToolProps) {
  const [selectedRole, setSelectedRole] = useState(data.role || '');
  const [customRole, setCustomRole] = useState(data.role === 'other' ? '' : '');
  const [selectedTools, setSelectedTools] = useState(data.tools || []);
  const [customTool, setCustomTool] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setError('');
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTools(prev => {
      if (prev.includes(tool)) {
        return prev.filter(t => t !== tool);
      } else {
        return [...prev, tool];
      }
    });
    setError('');
  };

  const handleAddCustomTool = () => {
    if (customTool.trim()) {
      setSelectedTools(prev => [...prev, `custom:${customTool.trim()}`]);
      setCustomTool('');
    }
  };

  const handleNext = () => {
    if (!selectedRole) {
      setError('Please select your role to continue.');
      return;
    }

    if (selectedRole === 'other' && !customRole.trim()) {
      setError('Please specify your role.');
      return;
    }

    if (selectedTools.length === 0) {
      setError('Please select at least one design tool.');
      return;
    }

    updateData({
      role: selectedRole,
      tools: selectedTools
    });
    
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Role selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            What best describes your role?
          </h3>
          <p className="text-sm text-gray-500">
            This helps us customize CopySnap for your specific workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ROLE_OPTIONS.map((role) => (
            <div
              key={role.id}
              className={`px-4 py-3 rounded-lg border text-center cursor-pointer transition-all ${
                selectedRole === role.id
                  ? 'border-primary bg-primary bg-opacity-5 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              {role.label}
            </div>
          ))}
        </div>
        
        {selectedRole === 'other' && (
          <div className="mt-3">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Your role..."
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Design tool selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            What design tools do you use regularly?
          </h3>
          <p className="text-sm text-gray-500">
            Select all that apply. We&apos;ll optimize integrations for your workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {TOOL_OPTIONS.map((tool) => (
            <div
              key={tool.id}
              className={`px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                selectedTools.includes(tool.id)
                  ? 'border-primary bg-primary bg-opacity-5 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              onClick={() => handleToolSelect(tool.id)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 flex-shrink-0 rounded border ${
                  selectedTools.includes(tool.id)
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}>
                  {selectedTools.includes(tool.id) && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span>{tool.label}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom tool input */}
        <div className="flex space-x-2 mt-2">
          <input
            type="text"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Other tool..."
            value={customTool}
            onChange={(e) => setCustomTool(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTool()}
          />
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={handleAddCustomTool}
          >
            Add
          </button>
        </div>
        
        {/* Display custom tools */}
        {selectedTools.filter(t => t.startsWith('custom:')).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTools
              .filter(t => t.startsWith('custom:'))
              .map((tool, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-1 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full"
                >
                  <span>{tool.replace('custom:', '')}</span>
                  <button
                    type="button"
                    className="text-primary hover:text-primary-dark"
                    onClick={() => setSelectedTools(prev => prev.filter(t => t !== tool))}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={onPrevious}
        >
          Back
        </button>
        <div className="flex space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={onNext}
          >
            Skip
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={handleNext}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 