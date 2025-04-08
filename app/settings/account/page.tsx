'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SettingsPageLayout from '../../components/SettingsPageLayout'

export default function AccountSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Demo User',
    email: 'user@example.com',
    company: 'Acme Inc.',
    jobTitle: 'Product Manager',
    timezone: 'America/New_York',
    language: 'en-US'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }, 800);
  };
  
  return (
    <SettingsPageLayout
      title="Account Settings"
      description="Manage your personal account information"
    >
      <div className="max-w-3xl mx-auto">
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
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="input"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    name="jobTitle"
                    type="text"
                    className="input"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
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
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
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
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* Password Change */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Password</h2>
            <button className="btn-secondary">Change Password</button>
          </div>
          
          {/* Account Preferences */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Account Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="font-medium text-gray-700">
                    Subscribe to newsletter
                  </label>
                  <p className="text-gray-500">Receive product updates and news</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketing"
                    name="marketing"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketing" className="font-medium text-gray-700">
                    Marketing communications
                  </label>
                  <p className="text-gray-500">Receive offers and promotions</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="p-6 bg-red-50">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <button className="btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  )
} 