'use client';

import React, { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import SettingsPageLayout from '../../components/SettingsPageLayout'
import { profileService } from '../../services/profile'
import { supabase } from '@/app/lib/supabase'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface FormData {
  name: string;
  email: string;
  password: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  } as FormData);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [passwordError, setPasswordError] = useState(null as string | null);
  const [successMessage, setSuccessMessage] = useState(null as string | null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const profile = await profileService.getCurrentUserProfile();
          
          setFormData((prev: FormData) => ({
            ...prev,
            name: profile?.full_name || '',
            email: user.email || '',
          }));
        }
      } catch (err) {
        setError('Failed to load account data');
        console.error('Error fetching account data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    // Update profile
    setTimeout(() => {
      profileService.updateProfile({ full_name: formData.name })
        .then(() => {
          setSuccessMessage('Profile updated successfully!');
          setIsEditing(false);
        })
        .catch(err => {
          setError('Failed to update profile');
          console.error('Error updating profile:', err);
        })
        .finally(() => {
          setIsSaving(false);
        });
    }, 800);
  };
  
  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);
    setPasswordError(null);
    setSuccessMessage(null);
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsSaving(false);
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setIsSaving(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });
      
      if (error) throw error;
      
      setSuccessMessage('Password updated successfully!');
      setIsChangingPassword(false);
      setFormData((prev: typeof formData) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setPasswordError('Failed to update password. ' + (err instanceof Error ? err.message : ''));
      console.error('Error updating password:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Call the API endpoint to delete the user and profile
          const response = await fetch(`/api/deleteuser/${user.id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete account');
          }
          
          // Sign out the user after successful deletion
          await supabase.auth.signOut();
          alert('Account deleted successfully.');
          router.push('/');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  
  return (
    <SettingsPageLayout
      title="Account Settings"
      description="Manage your account information and security settings"
    >
      <div className="max-w-3xl mx-auto">
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border divide-y">
          {/* Profile Information */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Account Information</h2>
              {!isEditing && (
                <button
                  type="button"
                  className="text-primary text-sm font-medium"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Information
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
                <span className="ml-2">Loading account data...</span>
              </div>
            ) : (
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
                      disabled={true}
                      title="Email cannot be changed directly"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to change your email address
                    </p>
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
          
          {/* Password Change */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Password</h2>
              {!isChangingPassword && (
                <button 
                  className="text-primary text-sm font-medium"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              )}
            </div>
            
            {isChangingPassword && (
              <form onSubmit={handlePasswordChange}>
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {passwordError}
                  </div>
                )}
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="input"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="input"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsChangingPassword(false)}
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
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Danger Zone */}
          <div className="p-6 bg-red-50">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <button
              onClick={handleDeleteAccount}
              className="btn-danger"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  )
} 