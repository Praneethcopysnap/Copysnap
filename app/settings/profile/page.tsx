'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SettingsPageLayout from '../../components/SettingsPageLayout'
import { profileService } from '../../services/profile'
import { supabase } from '@/app/lib/supabase'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface FormData {
  full_name: string;
  company: string;
  job_title: string;
  timezone: string;
  language: string;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    job_title: '',
    timezone: 'America/New_York',
    language: 'en-US'
  } as FormData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [missingFields, setMissingFields] = useState([] as string[]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await profileService.getCurrentUserProfile();
        
        if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            company: profile.company || '',
            job_title: profile.job_title || '',
            timezone: profile.timezone || 'America/New_York',
            language: profile.language || 'en-US'
          });
          
          // Check for missing fields
          const missing: string[] = [];
          if (!profile.full_name) missing.push('name');
          if (!profile.company) missing.push('company');
          if (!profile.job_title) missing.push('job title');
          
          setMissingFields(missing);
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      await profileService.updateProfile(formData);
      setIsEditing(false);
      
      // Update missing fields list after successful save
      const missing: string[] = [];
      if (!formData.full_name) missing.push('name');
      if (!formData.company) missing.push('company');
      if (!formData.job_title) missing.push('job title');
      setMissingFields(missing);
      
      router.refresh();
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <SettingsPageLayout
      title="Profile Settings"
      description="Manage your personal profile information"
    >
      <div className="max-w-3xl mx-auto">
        {missingFields.length > 0 && !isEditing && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Please complete your profile by adding your {missingFields.join(', ')}.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border divide-y">
          {/* Profile Information */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Profile Information</h2>
              {!isEditing && (
                <button
                  type="button"
                  className="text-primary text-sm font-medium"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-2">Loading profile...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      className={`input ${!formData.full_name && !isEditing ? 'border-orange-300 bg-orange-50' : ''}`}
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    {!formData.full_name && !isEditing && (
                      <p className="mt-1 text-xs text-orange-600">Please add your name</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className={`input ${!formData.company && !isEditing ? 'border-orange-300 bg-orange-50' : ''}`}
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    {!formData.company && !isEditing && (
                      <p className="mt-1 text-xs text-orange-600">Adding your company helps us personalize your experience</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      id="job_title"
                      name="job_title"
                      type="text"
                      className={`input ${!formData.job_title && !isEditing ? 'border-orange-300 bg-orange-50' : ''}`}
                      value={formData.job_title}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    {!formData.job_title && !isEditing && (
                      <p className="mt-1 text-xs text-orange-600">Your role helps us tailor content to your needs</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      className="input"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Shanghai">China (CST)</option>
                      <option value="Australia/Sydney">Sydney (AEST)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="input"
                      value={formData.language}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish</option>
                      <option value="fr-FR">French</option>
                      <option value="de-DE">German</option>
                      <option value="ja-JP">Japanese</option>
                      <option value="zh-CN">Chinese (Simplified)</option>
                    </select>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  );
} 