'use client';

import React from 'react'
import BrandVoiceSettings from '../../components/BrandVoiceSettings'
import SettingsPageLayout from '../../components/SettingsPageLayout'

export default function BrandVoicePage() {
  return (
    <SettingsPageLayout
      title="Brand Voice Settings"
      description="Define how your product communicates with users."
    >
      <BrandVoiceSettings />
    </SettingsPageLayout>
  )
} 