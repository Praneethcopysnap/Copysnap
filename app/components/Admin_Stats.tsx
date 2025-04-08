import React from 'react'

// Mock data for demonstration
const mockStats = [
  { name: 'Total Users', value: '237', change: '+12%', isPositive: true },
  { name: 'Active Workspaces', value: '182', change: '+8%', isPositive: true },
  { name: 'Copy Elements Generated', value: '4,532', change: '+25%', isPositive: true },
  { name: 'Figma Plugin Installs', value: '143', change: '-3%', isPositive: false },
];

export default function Admin_Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {mockStats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500 truncate">
            {stat.name}
          </p>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {stat.value}
            </p>
            <p className={`ml-2 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </p>
          </div>
          <div className="mt-4">
            <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`absolute h-full ${stat.isPositive ? 'bg-green-500' : 'bg-red-500'} rounded-full`} style={{ width: stat.isPositive ? '70%' : '40%' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 