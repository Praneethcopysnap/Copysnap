'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SettingsPageLayout from '../../components/SettingsPageLayout'

export default function NotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    emailDigest: true,
    newWorkspace: true,
    contentUpdates: true,
    teamChanges: true,
    productUpdates: false,
    marketingEmails: false,
    desktopNotifications: true,
    browserNotifications: false
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };
  
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Notification settings saved!');
    }, 800);
  };
  
  return (
    <SettingsPageLayout
      title="Notification Settings"
      description="Manage how and when you receive notifications"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Email Notifications */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weekly Digest</h3>
                  <p className="text-sm text-gray-500">Receive a weekly summary of your workspace activity</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.emailDigest ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('emailDigest')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.emailDigest ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Workspace Updates</h3>
                  <p className="text-sm text-gray-500">When changes are made to workspaces you own</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.newWorkspace ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('newWorkspace')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.newWorkspace ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Content Updates</h3>
                  <p className="text-sm text-gray-500">When content is added or modified in your workspaces</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.contentUpdates ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('contentUpdates')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.contentUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Team Updates</h3>
                  <p className="text-sm text-gray-500">When team members join or leave workspaces</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.teamChanges ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('teamChanges')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.teamChanges ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Updates */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Product & Marketing</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Product Updates</h3>
                  <p className="text-sm text-gray-500">Receive emails about new features and improvements</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.productUpdates ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('productUpdates')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.productUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive promotional content and offers</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.marketingEmails ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('marketingEmails')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Browser & Desktop */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Browser & Desktop Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Desktop App Notifications</h3>
                  <p className="text-sm text-gray-500">Show notifications in the desktop app</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.desktopNotifications ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('desktopNotifications')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.desktopNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Browser Push Notifications</h3>
                  <p className="text-sm text-gray-500">Show browser notifications when the app is not active</p>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.browserNotifications ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleToggle('browserNotifications')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.browserNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="btn-primary"
              onClick={saveSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  )
} 