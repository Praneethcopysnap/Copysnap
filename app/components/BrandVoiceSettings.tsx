'use client';

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function BrandVoiceSettings() {
  const [formData, setFormData] = useState({
    tone: ['professional'],
    customRules: '',
    examples: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClientComponentClient();
  
  // Tone options for the form
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'technical', label: 'Technical' },
    { value: 'witty', label: 'Witty' },
    { value: 'straightforward', label: 'Straightforward' },
  ];
  
  // Fetch existing brand voice settings
  useEffect(() => {
    const fetchBrandVoice = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          return;
        }
        
        if (!user) {
          console.log('No user found');
          setIsLoading(false);
          return;
        }
        
        // Fetch brand voice settings
        const { data, error } = await supabase
          .from('brand_voice')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching brand voice:', error);
        } else if (data) {
          // Update form with existing data
          setFormData({
            tone: data.tone || ['professional'],
            customRules: data.custom_rules || '',
            examples: data.examples || ''
          });
          console.log('Loaded brand voice settings:', data);
        }
      } catch (error) {
        console.error('Error in fetchBrandVoice:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrandVoice();
  }, [supabase]);
  
  const handleToneChange = (value: string) => {
    if (formData.tone.includes(value)) {
      setFormData({
        ...formData,
        tone: formData.tone.filter((tone: string) => tone !== value),
      });
    } else {
      setFormData({
        ...formData,
        tone: [...formData.tone, value],
      });
    }
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Make sure at least one tone is selected
    if (formData.tone.length === 0) {
      setSaveMessage({
        type: 'error',
        text: 'Please select at least one tone for your brand voice.'
      });
      return;
    }
    
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(userError.message);
      }
      
      if (!user) {
        throw new Error('You must be logged in to save brand voice settings');
      }
      
      // Check if settings already exist
      const { data: existingData, error: checkError } = await supabase
        .from('brand_voice')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(checkError.message);
      }
      
      let result;
      if (existingData) {
        // Update existing
        result = await supabase
          .from('brand_voice')
          .update({
            tone: formData.tone,
            custom_rules: formData.customRules,
            examples: formData.examples,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new
        result = await supabase
          .from('brand_voice')
          .insert({
            user_id: user.id,
            tone: formData.tone,
            custom_rules: formData.customRules,
            examples: formData.examples
          });
      }
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      console.log('Brand voice settings saved!');
      setSaveMessage({
        type: 'success',
        text: 'Brand voice settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving brand voice:', error);
      setSaveMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error saving brand voice settings'
      });
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (saveMessage.type === 'success') {
        setTimeout(() => {
          setSaveMessage({ type: '', text: '' });
        }, 3000);
      }
    }
  };
  
  // Render a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
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
      
      {saveMessage.type && (
        <div className={`rounded-md p-4 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {saveMessage.text}
        </div>
      )}
      
      <div className="flex justify-end">
        <button 
          onClick={handleSubmit}
          className="btn-primary"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Saving...
            </>
          ) : (
            'Save Brand Voice Settings'
          )}
        </button>
      </div>
    </div>
  )
} 