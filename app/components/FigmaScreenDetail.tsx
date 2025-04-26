import React, { useState } from 'react';
import { 
  FiX, FiZap, FiClock, FiCheckSquare, FiAlertTriangle, 
  FiSave, FiChevronRight, FiExternalLink 
} from 'react-icons/fi';
import { format } from 'date-fns';
import Image from 'next/image';

type FigmaScreen = {
  name: string;
  frameId: string;
  imageUrl: string;
  syncedAt: string;
  status: string;
};

type SuggestionType = 'UX Copy' | 'Microcopy' | 'Brand Alignment';

type Suggestion = {
  id: string;
  type: SuggestionType;
  text: string;
  isSelected: boolean;
};

interface FigmaScreenDetailProps {
  screen: FigmaScreen | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateSuggestions: (screen: FigmaScreen) => void;
  isGenerating: boolean;
  suggestions: Suggestion[];
  onSuggestionSelect: (suggestionId: string) => void;
  onSaveSuggestions: () => void;
}

const FigmaScreenDetail = ({
  screen,
  isOpen,
  onClose,
  onGenerateSuggestions,
  isGenerating,
  suggestions,
  onSuggestionSelect,
  onSaveSuggestions
}: FigmaScreenDetailProps) => {
  const [activeTab, setActiveTab] = useState('UX Copy' as SuggestionType);

  if (!isOpen || !screen) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const filteredSuggestions = suggestions.filter(s => s.type === activeTab);
  const hasSelectedSuggestions = suggestions.some(s => s.isSelected);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{screen.name}</h2>
            <p className="text-sm text-gray-500">
              <FiClock className="inline mr-1" size={14} />
              Last synced: {formatDate(screen.syncedAt)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left side - Image */}
          <div className="w-1/2 border-r overflow-auto p-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm">
              {screen.imageUrl ? (
                <Image
                  src={screen.imageUrl}
                  alt={screen.name}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-video flex items-center justify-center text-gray-400">
                  No preview available
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <div className="text-sm text-gray-500">
                Frame ID: <span className="font-mono text-xs">{screen.frameId}</span>
              </div>
              <a 
                href={`https://www.figma.com/file/${screen.frameId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Open in Figma <FiExternalLink className="ml-1" size={14} />
              </a>
            </div>
          </div>

          {/* Right side - Suggestions */}
          <div className="w-1/2 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b">
              {(['UX Copy', 'Microcopy', 'Brand Alignment'] as SuggestionType[]).map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm font-medium flex-1 ${
                    activeTab === tab 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="animate-spin mb-4">
                    <FiZap size={24} className="text-blue-600" />
                  </div>
                  <p className="text-gray-600">Generating {activeTab} suggestions...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : filteredSuggestions.length > 0 ? (
                <div className="p-4 space-y-3">
                  {filteredSuggestions.map((suggestion) => (
                    <div 
                      key={suggestion.id}
                      className={`p-3 rounded-lg border ${
                        suggestion.isSelected 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button 
                          onClick={() => onSuggestionSelect(suggestion.id)}
                          className={`mt-0.5 p-1 rounded ${
                            suggestion.isSelected ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {suggestion.isSelected ? <FiCheckSquare /> : <FiCheckSquare />}
                        </button>
                        <div className="flex-1">
                          <p className="text-sm">{suggestion.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-4 text-gray-300">
                    <FiZap size={24} />
                  </div>
                  <p className="text-gray-600">No {activeTab.toLowerCase()} suggestions yet</p>
                  <button
                    onClick={() => onGenerateSuggestions(screen)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700"
                  >
                    <FiZap className="mr-2" />
                    Generate Suggestions
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {hasSelectedSuggestions 
                  ? `${suggestions.filter(s => s.isSelected).length} suggestions selected` 
                  : 'Select suggestions to apply'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onGenerateSuggestions(screen)}
                  disabled={isGenerating}
                  className="px-3 py-2 border border-gray-300 rounded text-sm flex items-center hover:bg-gray-50"
                >
                  <FiZap className="mr-1" size={14} />
                  Regenerate
                </button>
                <button
                  onClick={onSaveSuggestions}
                  disabled={!hasSelectedSuggestions}
                  className={`px-3 py-2 rounded text-sm flex items-center ${
                    hasSelectedSuggestions
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FiSave className="mr-1" size={14} />
                  Apply Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaScreenDetail; 