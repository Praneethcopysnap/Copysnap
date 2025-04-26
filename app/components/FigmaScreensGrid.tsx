import React, { useState } from 'react';
import { FiEdit2, FiZap, FiCheck, FiClock, FiMaximize2, FiTag, FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';

type FigmaScreen = {
  name: string;
  frameId: string;
  imageUrl: string;
  syncedAt: string;
  status: string;
};

interface FigmaScreensGridProps {
  screens: FigmaScreen[];
  onGenerateSuggestions: (screen: FigmaScreen) => void;
  onScreenSelect: (screen: FigmaScreen) => void;
  onScreenNameChange: (screen: FigmaScreen, newName: string) => void;
  onScreenStatusChange: (screen: FigmaScreen, newStatus: string) => void;
  searchQuery?: string;
  statusFilter?: string | null;
  isLoading?: boolean;
}

// Available status options
const STATUS_OPTIONS = [
  'Needs Copy',
  'In Progress',
  'Reviewed',
  'Synced',
  'Copy Applied'
];

const FigmaScreensGrid = ({
  screens,
  onGenerateSuggestions,
  onScreenSelect,
  onScreenNameChange,
  onScreenStatusChange,
  searchQuery = '',
  statusFilter = null,
  isLoading = false
}: FigmaScreensGridProps) => {
  const [editingId, setEditingId] = useState('');
  const [editedName, setEditedName] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(null as string | null);

  // Filter screens based on search query and status filter
  const filteredScreens = screens.filter(screen => {
    const matchesSearch = searchQuery 
      ? screen.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter
      ? screen.status === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditStart = (screen: FigmaScreen) => {
    setEditingId(screen.frameId);
    setEditedName(screen.name);
  };

  const handleEditCancel = () => {
    setEditingId('');
  };

  const handleEditSave = (screen: FigmaScreen) => {
    if (editedName.trim() !== '') {
      onScreenNameChange(screen, editedName);
    }
    setEditingId('');
  };

  const toggleStatusDropdown = (screenId: string) => {
    setShowStatusDropdown((current: string | null) => current === screenId ? null : screenId);
  };

  const handleStatusChange = (screen: FigmaScreen, newStatus: string) => {
    onScreenStatusChange(screen, newStatus);
    setShowStatusDropdown(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Needs Copy':
        return 'bg-amber-100 text-amber-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'Synced':
        return 'bg-emerald-100 text-emerald-800';
      case 'Copy Applied':
        return 'bg-violet-100 text-violet-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Needs Copy':
        return <FiEdit2 className="mr-1" />;
      case 'In Progress':
        return <FiClock className="mr-1" />;
      case 'Reviewed':
        return <FiCheck className="mr-1" />;
      case 'Synced':
        return <FiCheck className="mr-1" />;
      case 'Copy Applied':
        return <FiCheck className="mr-1" />;
      default:
        return null;
    }
  };

  if (!screens || screens.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-500 mb-2">No screens to display</p>
          <p className="text-gray-400 text-sm">Select a folder to view screens</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500">Loading screens...</p>
        </div>
      </div>
    );
  }

  if (filteredScreens.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-500 mb-2">No screens match your filters</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredScreens.map((screen) => (
          <div 
            key={screen.frameId}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden group relative"
          >
            {/* Card Content */}
            <div className="relative aspect-video bg-gray-100">
              {screen.imageUrl ? (
                <Image 
                  src={screen.imageUrl} 
                  alt={screen.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No preview
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3">
                <button 
                  onClick={() => onScreenSelect(screen)}
                  className="text-white bg-black/40 hover:bg-black/60 p-2 rounded-full"
                  title="View full screen"
                >
                  <FiMaximize2 size={16} />
                </button>
                <button 
                  onClick={() => onGenerateSuggestions(screen)}
                  className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
                  title="Generate suggestions"
                >
                  <FiZap size={16} />
                </button>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="p-3 flex flex-col">
              {editingId === screen.frameId ? (
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    autoFocus
                    onBlur={() => handleEditSave(screen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSave(screen);
                      if (e.key === 'Escape') handleEditCancel();
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <h3 
                    className="text-sm font-medium flex-1 truncate pr-2" 
                    title={screen.name}
                  >
                    {screen.name}
                  </h3>
                  <button 
                    onClick={() => handleEditStart(screen)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Edit name"
                  >
                    <FiEdit2 size={14} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                {/* Status Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => toggleStatusDropdown(screen.frameId)}
                    className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(screen.status)}`}
                    title="Change status"
                  >
                    {getStatusIcon(screen.status)}
                    {screen.status}
                    <FiChevronDown className="ml-1" size={12} />
                  </button>
                  
                  {showStatusDropdown === screen.frameId && (
                    <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {STATUS_OPTIONS.map(status => (
                        <button
                          key={status}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center ${
                            screen.status === status ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                          onClick={() => handleStatusChange(screen, status)}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => onGenerateSuggestions(screen)}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded flex items-center"
                >
                  <FiZap className="mr-1" size={12} />
                  Generate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaScreensGrid; 