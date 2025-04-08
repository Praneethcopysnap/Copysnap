'use client';

import React, { useState } from 'react';
import SettingsPageLayout from '../../components/SettingsPageLayout';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar: string;
  status: 'active' | 'pending';
  joinedAt?: string;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState([
    {
      id: 'user1',
      name: 'You',
      email: 'user@example.com',
      role: 'owner',
      avatar: '👤',
      status: 'active',
      joinedAt: 'Jan 15, 2023'
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      avatar: '👩',
      status: 'active',
      joinedAt: 'Mar 22, 2023'
    },
    {
      id: 'user3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'editor',
      avatar: '👨',
      status: 'active',
      joinedAt: 'Apr 5, 2023'
    },
    {
      id: 'user4',
      name: 'Invited User',
      email: 'invited@example.com',
      role: 'viewer',
      avatar: '👤',
      status: 'pending'
    }
  ] as TeamMember[]);

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor' as TeamMember['role']);

  const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setMembers(prevMembers => 
        prevMembers.filter(member => member.id !== memberId)
      );
    }
  };

  const handleInviteSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (!inviteEmail) {
      alert('Please enter an email address');
      return;
    }
    
    // In a real app, this would make an API call to send an invitation
    const newMember: TeamMember = {
      id: `user${members.length + 1}`,
      name: 'Invited User',
      email: inviteEmail,
      role: inviteRole,
      avatar: '👤',
      status: 'pending'
    };
    
    setMembers(prevMembers => [...prevMembers, newMember]);
    setInviteEmail('');
    setInviteRole('editor' as TeamMember['role']);
    setShowInviteForm(false);
    
    alert(`Invitation sent to ${inviteEmail}`);
  };

  const handleResendInvite = (email: string) => {
    // In a real app, this would make an API call to resend the invitation
    alert(`Invitation resent to ${email}`);
  };

  return (
    <SettingsPageLayout
      title="Team Members"
      description="Invite and manage your team members"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Team Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowInviteForm(true)}
        >
          Invite New Member
        </button>
      </div>
      
      {showInviteForm && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-3">Invite New Team Member</h3>
          <form onSubmit={handleInviteSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="inviteEmail"
                  type="email"
                  className="input"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="inviteRole"
                  className="input"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map(member => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-lg">{member.avatar}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                        {member.role === 'owner' && (
                          <span className="ml-2 text-xs font-semibold text-primary">(You)</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.role === 'owner' ? (
                    <span className="text-sm text-gray-900">Owner</span>
                  ) : (
                    <select
                      className="text-sm border-gray-300 rounded-md"
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as TeamMember['role'])}
                      disabled={member.id === 'user1'} // Can't change own role
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.status === 'active' ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending Invitation
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {member.id !== 'user1' && ( // Can't remove yourself
                    <>
                      {member.status === 'pending' && (
                        <button
                          onClick={() => handleResendInvite(member.email)}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          Resend
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <h2 className="text-lg font-semibold mb-4">Role Permissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Create Content
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edit Content
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manage Team
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billing Access
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Owner
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Admin
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Editor
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Viewer
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SettingsPageLayout>
  );
}