import React from 'react';
import { FiFileText, FiAlertCircle, FiRefreshCw, FiLink } from 'react-icons/fi';

type EmptyStateType = 'noLink' | 'linkError' | 'noScreens' | 'syncError' | 'filterEmpty';

interface FigmaEmptyStateProps {
  type: EmptyStateType;
  onResync?: () => void;
  onUpdateLink?: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

type StateConfig = {
  icon: JSX.Element;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    handler?: () => void;
    icon: JSX.Element;
  };
};

const FigmaEmptyState = ({
  type,
  onResync,
  onUpdateLink,
  isLoading = false,
  errorMessage
}: FigmaEmptyStateProps) => {
  // Configuration for different empty states
  const stateConfig: Record<EmptyStateType, StateConfig> = {
    noLink: {
      icon: <FiLink size={48} className="text-gray-300 mb-4" />,
      title: 'No Figma Link Found',
      description: 'Connect your Figma design file to see screens here.',
      primaryAction: {
        label: 'Add Figma Link',
        handler: onUpdateLink,
        icon: <FiLink className="mr-2" />
      }
    },
    linkError: {
      icon: <FiAlertCircle size={48} className="text-red-300 mb-4" />,
      title: 'Invalid Figma Link',
      description: errorMessage || 'The Figma link seems to be invalid or inaccessible.',
      primaryAction: {
        label: 'Update Figma Link',
        handler: onUpdateLink,
        icon: <FiLink className="mr-2" />
      }
    },
    noScreens: {
      icon: <FiFileText size={48} className="text-gray-300 mb-4" />,
      title: 'No Screens Found',
      description: 'No frames or components were found in the linked Figma file.',
      primaryAction: {
        label: 'Sync Again',
        handler: onResync,
        icon: <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
      }
    },
    syncError: {
      icon: <FiAlertCircle size={48} className="text-red-300 mb-4" />,
      title: 'Sync Failed',
      description: errorMessage || 'There was an error syncing with Figma. Please try again.',
      primaryAction: {
        label: 'Try Again',
        handler: onResync,
        icon: <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
      }
    },
    filterEmpty: {
      icon: <FiFileText size={48} className="text-gray-300 mb-4" />,
      title: 'No Matching Screens',
      description: 'No screens match your current filters or search query.'
      // No primary action for filter empty
    }
  };

  const config = stateConfig[type];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {config.icon}
        <h3 className="text-lg font-medium text-gray-800 mb-2">{config.title}</h3>
        <p className="text-gray-500 mb-6">{config.description}</p>
        
        {config.primaryAction && (
          <button
            onClick={config.primaryAction.handler}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed mx-auto"
          >
            {config.primaryAction.icon}
            {config.primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default FigmaEmptyState; 