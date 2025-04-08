'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiUser, FiVolume2, FiBell, FiLink, FiCreditCard, FiUsers, FiKey } from 'react-icons/fi'

const settingsSections = [
  {
    id: 'account',
    name: 'Account Settings',
    description: 'Manage your account details and preferences',
    icon: <FiUser size={20} />,
    link: '/settings/account'
  },
  {
    id: 'brand',
    name: 'Brand Voice',
    description: 'Define your brand voice and tone for generated content',
    icon: <FiVolume2 size={20} />,
    link: '/settings/brand'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure your notification preferences',
    icon: <FiBell size={20} />,
    link: '/settings/notifications'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Connect with Figma, Slack, and other tools',
    icon: <FiLink size={20} />,
    link: '/settings/integrations'
  },
  {
    id: 'billing',
    name: 'Billing & Subscription',
    description: 'Manage your subscription plan and payment details',
    icon: <FiCreditCard size={20} />,
    link: '/settings/billing'
  },
  {
    id: 'team',
    name: 'Team Members',
    description: 'Invite and manage your team members',
    icon: <FiUsers size={20} />,
    link: '/settings/team'
  },
  {
    id: 'api',
    name: 'API Access',
    description: 'View and manage your API keys and access tokens',
    icon: <FiKey size={20} />,
    link: '/settings/api'
  }
];

export default function SettingsSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full min-h-screen">
      <nav className="space-y-1">
        {settingsSections.map(section => {
          const isActive = pathname === section.link;
          
          return (
            <Link 
              key={section.id}
              href={section.link}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="mr-3 text-current">{section.icon}</span>
              <span>{section.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  )
} 