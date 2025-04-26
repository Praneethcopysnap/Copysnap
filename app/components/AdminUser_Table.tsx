import React from 'react'

// Mock data for demonstration
const mockUsers = [
  {
    id: 'user1',
    name: 'Alexandra Chen',
    email: 'alex@example.com',
    role: 'Designer',
    workspaces: 3,
    signupDate: '2023-11-20',
    status: 'active'
  },
  {
    id: 'user2',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'Product Manager',
    workspaces: 2,
    signupDate: '2023-11-18',
    status: 'active'
  },
  {
    id: 'user3',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'Content Writer',
    workspaces: 1,
    signupDate: '2023-11-15',
    status: 'inactive'
  },
  {
    id: 'user4',
    name: 'David Garcia',
    email: 'david@example.com',
    role: 'UI/UX Designer',
    workspaces: 4,
    signupDate: '2023-11-12',
    status: 'active'
  },
  {
    id: 'user5',
    name: 'Emily Taylor',
    email: 'emily@example.com',
    role: 'Marketing Manager',
    workspaces: 2,
    signupDate: '2023-11-10',
    status: 'active'
  }
];

export default function AdminUser_Table() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workspaces
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">{user.name.substring(0, 2)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.workspaces}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.signupDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">View</button>
                  <button className="text-gray-600 hover:text-gray-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">5</span> of <span className="font-medium">23</span> users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded text-sm">Previous</button>
          <button className="px-3 py-1 bg-primary text-white rounded text-sm">Next</button>
        </div>
      </div>
    </div>
  )
} 