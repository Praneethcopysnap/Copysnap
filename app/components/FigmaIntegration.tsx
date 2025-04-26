import React, { useState, useEffect } from 'react';
import FigmaSidebar from './FigmaSidebar';
import FigmaScreensGrid from './FigmaScreensGrid';
import FigmaScreensHeader from './FigmaScreensHeader';
import FigmaScreenDetail from './FigmaScreenDetail';
import FigmaScreensSkeleton from './FigmaScreensSkeleton';
import FigmaEmptyState from './FigmaEmptyState';

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

type Suggestion = {
  id: string;
  type: 'UX Copy' | 'Microcopy' | 'Brand Alignment';
  text: string;
  isSelected: boolean;
};

interface FigmaIntegrationProps {
  workspaceId: string;
  figmaLink?: string | null;
  screens?: FigmaScreens | null;
  isLoading?: boolean;
  syncError?: string | null;
  onUpdateFigmaLink: (link: string) => Promise<void>;
  onSyncFigma: (workspaceId: string) => Promise<void>;
  onUpdateScreenName: (screen: FigmaScreen, newName: string) => Promise<void>;
  onUpdateScreenStatus: (screen: FigmaScreen, newStatus: string) => Promise<void>;
  onGenerateSuggestions: (screen: FigmaScreen) => Promise<Suggestion[]>;
  onSaveSuggestions: (screen: FigmaScreen, suggestions: Suggestion[]) => Promise<void>;
  workspaceTheme?: string;
}

const FigmaIntegration = ({
  workspaceId,
  figmaLink,
  screens,
  isLoading = false,
  syncError,
  onUpdateFigmaLink,
  onSyncFigma,
  onUpdateScreenName,
  onUpdateScreenStatus,
  onGenerateSuggestions,
  onSaveSuggestions,
  workspaceTheme = 'default'
}: FigmaIntegrationProps) => {
  // State for UI interactions
  const [selectedPage, setSelectedPage] = useState(null as string | null);
  const [selectedScreen, setSelectedScreen] = useState(null as FigmaScreen | null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null as string | null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Session storage for selected page
  useEffect(() => {
    // Load selected page from session storage
    const storedPage = sessionStorage.getItem(`figma-selected-page-${workspaceId}`);
    if (storedPage && screens && screens[storedPage]) {
      setSelectedPage(storedPage);
    } else if (screens && Object.keys(screens).length > 0) {
      // Select the first page if none is stored
      setSelectedPage(Object.keys(screens)[0]);
    }
  }, [workspaceId, screens]);
  
  // Save selected page to session storage when it changes
  useEffect(() => {
    if (selectedPage) {
      sessionStorage.setItem(`figma-selected-page-${workspaceId}`, selectedPage);
    }
  }, [selectedPage, workspaceId]);
  
  // Handle page selection
  const handlePageSelect = (pageName: string) => {
    setSelectedPage(pageName);
  };
  
  // Get screens for the selected page, or all screens if no page selected
  const getScreensToDisplay = (): FigmaScreen[] => {
    if (!screens) return [];
    
    if (selectedPage && screens[selectedPage]) {
      return screens[selectedPage];
    }
    
    // Flatten all pages into a single array
    return Object.values(screens).flat();
  };
  
  // Handle screen selection for detail view
  const handleScreenSelect = (screen: FigmaScreen) => {
    setSelectedScreen(screen);
    setIsDetailModalOpen(true);
  };
  
  // Handle generating suggestions
  const handleGenerateSuggestions = async (screen: FigmaScreen) => {
    setIsGeneratingSuggestions(true);
    try {
      const newSuggestions = await onGenerateSuggestions(screen);
      setSuggestions(newSuggestions);
      
      // If not already open, open the detail modal
      if (!isDetailModalOpen) {
        setSelectedScreen(screen);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestionId: string) => {
    setSuggestions((prev: Suggestion[]) => 
      prev.map((suggestion: Suggestion) => 
        suggestion.id === suggestionId 
          ? { ...suggestion, isSelected: !suggestion.isSelected }
          : suggestion
      )
    );
  };
  
  // Handle saving suggestions
  const handleSaveSuggestions = async () => {
    if (!selectedScreen) return;
    
    try {
      await onSaveSuggestions(selectedScreen, suggestions);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Error saving suggestions:', error);
    }
  };
  
  // Count total screens across all pages
  const getTotalScreenCount = (): number => {
    if (!screens) return 0;
    return Object.values(screens).reduce(
      (total, pageScreens) => total + pageScreens.length, 
      0
    );
  };
  
  // Determine what to render based on current state
  const renderContent = () => {
    // No Figma link
    if (!figmaLink) {
      return (
        <FigmaEmptyState 
          type="noLink" 
          onUpdateLink={() => {
            const link = prompt('Enter your Figma link:');
            if (link) onUpdateFigmaLink(link);
          }}
        />
      );
    }
    
    // Error with Figma link
    if (syncError && !screens) {
      return (
        <FigmaEmptyState 
          type="linkError" 
          errorMessage={syncError}
          onUpdateLink={() => {
            const link = prompt('Enter your Figma link:', figmaLink || '');
            if (link) onUpdateFigmaLink(link);
          }}
          onResync={() => onSyncFigma(workspaceId)}
        />
      );
    }
    
    // Loading state
    if (isLoading && !screens) {
      return <FigmaScreensSkeleton />;
    }
    
    // No screens found after successful sync
    if (screens && Object.keys(screens).length === 0) {
      return (
        <FigmaEmptyState 
          type="noScreens" 
          onResync={() => onSyncFigma(workspaceId)}
          onUpdateLink={() => {
            const link = prompt('Enter your Figma link:', figmaLink || '');
            if (link) onUpdateFigmaLink(link);
          }}
          isLoading={isLoading}
        />
      );
    }
    
    // Normal view with screens
    return (
      <>
        <FigmaScreensHeader 
          selectedPage={selectedPage}
          totalScreens={getTotalScreenCount()}
          onSearchChange={setSearchQuery}
          onFilterChange={setStatusFilter}
          onResyncFigma={() => onSyncFigma(workspaceId)}
          isResyncing={isLoading}
          onUpdateFigmaLink={() => {
            const link = prompt('Enter your Figma link:', figmaLink || '');
            if (link) onUpdateFigmaLink(link);
          }}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {screens && (
            <FigmaScreensGrid 
              screens={getScreensToDisplay()}
              onGenerateSuggestions={handleGenerateSuggestions}
              onScreenSelect={handleScreenSelect}
              onScreenNameChange={onUpdateScreenName}
              onScreenStatusChange={onUpdateScreenStatus}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              isLoading={isLoading}
            />
          )}
        </div>
      </>
    );
  };
  
  return (
    <div className={`flex flex-col h-full bg-gray-50 ${workspaceTheme}`}>
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar with folders/pages */}
        {screens && Object.keys(screens).length > 0 && (
          <FigmaSidebar 
            screens={screens}
            isLoading={isLoading}
            onPageSelect={handlePageSelect}
            onSyncFigma={() => onSyncFigma(workspaceId)}
            selectedPage={selectedPage}
          />
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderContent()}
        </div>
      </div>
      
      {/* Screen detail modal */}
      <FigmaScreenDetail 
        screen={selectedScreen}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onGenerateSuggestions={handleGenerateSuggestions}
        isGenerating={isGeneratingSuggestions}
        suggestions={suggestions}
        onSuggestionSelect={handleSuggestionSelect}
        onSaveSuggestions={handleSaveSuggestions}
      />
    </div>
  );
};

export default FigmaIntegration; 