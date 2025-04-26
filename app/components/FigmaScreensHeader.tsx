import React, { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiFilter, FiChevronDown } from 'react-icons/fi';

interface FigmaScreensHeaderProps {
  selectedPage: string | null;
  totalScreens: number;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: string | null) => void;
  onResyncFigma: () => void;
  isResyncing: boolean;
  onUpdateFigmaLink?: () => void;
}

// Status options for filtering
const STATUS_OPTIONS = [
  { value: null, label: 'All Statuses' },
  { value: 'Needs Copy', label: 'Needs Copy' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Reviewed', label: 'Reviewed' },
  { value: 'Synced', label: 'Synced' },
  { value: 'Copy Applied', label: 'Copy Applied' }
];

const FigmaScreensHeader = ({
  selectedPage,
  totalScreens,
  onSearchChange,
  onFilterChange,
  onResyncFigma,
  isResyncing,
  onUpdateFigmaLink
}: FigmaScreensHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null as string | null);

  // Update parent component when search changes
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(handler);
  }, [searchQuery, onSearchChange]);

  // Handle filter selection
  const handleFilterSelect = (status: string | null) => {
    setSelectedFilter(status);
    onFilterChange(status);
    setShowFilterDropdown(false);
  };

  // Handle toggle of filter dropdown with proper typing
  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev: boolean) => !prev);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h2 className="text-lg font-medium">
          {selectedPage ? selectedPage : 'All Screens'}
        </h2>
        <p className="text-sm text-gray-500">{totalScreens} screens</p>
      </div>
      
      <div className="flex space-x-2">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search screens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-60"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            onClick={toggleFilterDropdown}
          >
            <FiFilter className="mr-2" />
            {selectedFilter || 'All Statuses'}
            <FiChevronDown className="ml-2" />
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.label}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedFilter === option.value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => handleFilterSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Resync Button */}
        <button
          onClick={onResyncFigma}
          disabled={isResyncing}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
        >
          <FiRefreshCw className={`mr-2 ${isResyncing ? 'animate-spin' : ''}`} />
          Resync from Figma
        </button>
        
        {/* Edit Figma Link Button */}
        {onUpdateFigmaLink && (
          <button
            onClick={onUpdateFigmaLink}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.486 0 0 4.486 0 10c0 5.514 4.486 10 10 10s10-4.486 10-10C20 4.486 15.514 0 10 0z" fill="#1ABCFE" />
              <path d="M8.5 10a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 8.5 10z" fill="white" />
              <path d="M5.5 15a1.5 1.5 0 1 0 1.5-1.5h-1.5V15z" fill="white" />
              <path d="M7 7v1.5h1.5a1.5 1.5 0 1 0-1.5-1.5z" fill="white" />
              <path d="M14.5 10a1.5 1.5 0 1 0-1.5 1.5V10H14.5z" fill="white" />
              <path d="M13 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="white" />
            </svg>
            Update Link
          </button>
        )}
      </div>
    </div>
  );
};

export default FigmaScreensHeader; 