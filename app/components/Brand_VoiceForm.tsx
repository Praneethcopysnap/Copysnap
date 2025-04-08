'use client';

import React, { useState } from 'react'

export default function Brand_VoiceForm() {
  const [formData, setFormData] = useState({
    tone: ['professional'],
    customRules: '',
    examples: '',
  });
  
  const [saved, setSaved] = useState(false);
  
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'technical', label: 'Technical' },
    { value: 'witty', label: 'Witty' },
    { value: 'straightforward', label: 'Straightforward' },
  ];
  
  const handleToneChange = (value: string) => {
    if (formData.tone.includes(value)) {
      setFormData({
        ...formData,
        tone: formData.tone.filter(tone => tone !== value),
      });
    } else {
      setFormData({
        ...formData,
        tone: [...formData.tone, value],
      });
    }
  };
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // In a real app, this would be sent to an API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  
  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Voice Characteristics</h2>
        <p className="text-gray-600 mb-4">
          Choose the characteristics that best describe your brand's tone of voice.
          Select multiple if needed.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {toneOptions.map(option => (
            <label 
              key={option.value}
              className={`
                flex items-center p-3 border rounded-md cursor-pointer
                ${formData.tone.includes(option.value) 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'}
              `}
            >
              <input 
                type="checkbox" 
                className="mr-2"
                checked={formData.tone.includes(option.value)} 
                onChange={() => handleToneChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Custom Rules</h2>
        <p className="text-gray-600 mb-4">
          Add any specific rules or guidelines for your brand's voice.
          For example: "Don't use exclamation marks" or "Keep copy concise".
        </p>
        
        <textarea 
          className="input min-h-[120px]"
          value={formData.customRules}
          onChange={e => setFormData({...formData, customRules: e.target.value})}
          placeholder="Enter your custom voice rules here..."
        />
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Example Copy</h2>
        <p className="text-gray-600 mb-4">
          Paste examples of good copy that matches your brand voice.
          This helps our AI understand and match your style.
        </p>
        
        <textarea 
          className="input min-h-[120px]"
          value={formData.examples}
          onChange={e => setFormData({...formData, examples: e.target.value})}
          placeholder="Enter example copy that represents your brand voice well..."
        />
      </div>
      
      <div className="flex justify-end">
        {saved && (
          <div className="text-green-600 flex items-center mr-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settings saved
          </div>
        )}
        <button 
          onClick={handleSubmit}
          className="btn-primary"
        >
          Save Brand Voice Settings
        </button>
      </div>
    </div>
  )
} 