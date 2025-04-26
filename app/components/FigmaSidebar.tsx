import React, { useState } from 'react';
import { FiFolder, FiChevronDown, FiChevronRight, FiRefreshCw, FiLayout } from 'react-icons/fi';

type FigmaScreen = {
  name: string;
  frameId: string;
  imageUrl: string;
  syncedAt: string;
  status: string;
};

type FigmaScreens = {
  [pageName: string]: FigmaScreen[];
};

interface FigmaSidebarProps {
  screens: FigmaScreens;
  isLoading: boolean;
  onPageSelect: (pageName: string) => void;
  onSyncFigma: () => void;
  selectedPage: string | null;
}

const FigmaSidebar = ({
  screens,
  isLoading,
  onPageSelect,
  onSyncFigma,
  selectedPage
}: FigmaSidebarProps) => {
  const [expandedPages, setExpandedPages] = useState({} as Record<string, boolean>);

  // Count total screens
  const totalScreens = Object.values(screens || {}).reduce(
    (total, pageScreens) => total + (pageScreens as FigmaScreen[]).length, 
    0
  );
  
  // Toggle expanded state for a page
  const togglePage = (pageName: string) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageName]: !prev[pageName]
    }));
  };

  // If no screens are available
  if (!screens || Object.keys(screens).length === 0) {
    return (
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-gray-900">Design Screens</h3>
          <button
            onClick={onSyncFigma}
            disabled={isLoading}
            className="p-1 rounded hover:bg-gray-200"
            title="Sync with Figma"
          >
            <FiRefreshCw className={`text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-sm text-gray-500 py-4 text-center">
          <FiLayout className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No design screens available</p>
          <p className="text-xs mt-1">Sync with Figma to load screens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Design Screens</h3>
        <button
          onClick={onSyncFigma}
          disabled={isLoading}
          className="p-1 rounded hover:bg-gray-200"
          title="Sync with Figma"
        >
          <FiRefreshCw className={`text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        {totalScreens} screens from Figma
      </div>
      
      <div className="space-y-1">
        {Object.entries(screens).map(([pageName, pageScreens]) => (
          <div key={pageName} className="mb-1">
            <div 
              className={`flex items-center py-2 px-2 rounded-md cursor-pointer hover:bg-gray-200 ${
                selectedPage === pageName ? 'bg-blue-50 text-blue-700' : ''
              }`}
              onClick={() => {
                onPageSelect(pageName);
                if (!expandedPages[pageName]) {
                  togglePage(pageName);
                }
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePage(pageName);
                }}
                className="mr-1 focus:outline-none"
              >
                {expandedPages[pageName] ? (
                  <FiChevronDown className="text-gray-500" />
                ) : (
                  <FiChevronRight className="text-gray-500" />
                )}
              </button>
              <FiFolder className={`mr-2 ${selectedPage === pageName ? 'text-blue-700' : 'text-gray-400'}`} />
              <span className="text-sm font-medium truncate flex-1">{pageName}</span>
              <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
                {(pageScreens as FigmaScreen[]).length}
              </span>
            </div>
            
            {expandedPages[pageName] && (
              <div className="ml-9 mt-1 space-y-1">
                {(pageScreens as FigmaScreen[]).map((screen) => (
                  <div
                    key={screen.frameId}
                    className="text-xs py-1 px-2 rounded-md text-gray-700 truncate hover:bg-gray-100 cursor-pointer"
                    title={screen.name}
                    onClick={() => onPageSelect(pageName)}
                  >
                    {screen.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaSidebar; 