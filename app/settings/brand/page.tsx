'use client';

import React from 'react'
import BrandVoiceForm from '../../components/Brand_VoiceForm'
import SettingsPageLayout from '../../components/SettingsPageLayout'

export default function BrandVoicePage() {
  return (
    <SettingsPageLayout
      title="Brand Voice Settings"
      description="Define how your product communicates with users."
    >
      <BrandVoiceForm />
    </SettingsPageLayout>
  )
} 