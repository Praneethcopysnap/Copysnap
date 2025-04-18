import React from 'react'
import Link from 'next/link'
import AdminStatsComponent from '../components/Admin_Stats'
import AdminUserTable from '../components/AdminUser_Table'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">
                  <span className="text-primary">Copy</span>
                  <span className="text-secondary">Snap</span>
                </h1>
              </Link>
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md">
                Admin
              </span>
            </div>
            
            <div className="flex items-center">
              <nav className="flex space-x-4">
                <Link href="/admin" className="text-primary font-medium px-3 py-2 rounded-md text-sm">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Users
                </Link>
                <Link href="/admin/features" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link href="/admin/settings" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor CopySnap usage and manage features.</p>
        </div>
        
        <AdminStatsComponent />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Signups</h2>
          <AdminUserTable />
        </div>
        
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Feature Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Figma Plugin</h3>
                <p className="text-sm text-gray-500">Allow users to access the Figma integration</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input type="checkbox" id="toggle-figma" className="sr-only peer" defaultChecked />
                <span className="absolute inset-0 peer-checked:bg-primary rounded-full transition-colors cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Brand Voice Analysis</h3>
                <p className="text-sm text-gray-500">Advanced tone detection and styling</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input type="checkbox" id="toggle-brand" className="sr-only peer" />
                <span className="absolute inset-0 peer-checked:bg-primary rounded-full transition-colors cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Document Processing</h3>
                <p className="text-sm text-gray-500">Upload and analyze product documents</p>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <input type="checkbox" id="toggle-docs" className="sr-only peer" defaultChecked />
                <span className="absolute inset-0 peer-checked:bg-primary rounded-full transition-colors cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 