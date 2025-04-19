'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspaces } from '../../context/workspaces';
import SiteHeader from "@/app/components/SiteHeader";
import SidebarNav from "@/app/components/SidebarNav";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiShare2, 
  FiFileText, FiMessageSquare, FiAlertCircle, FiHelpCircle, 
  FiInfo, FiClock, FiUser, FiUsers, FiSettings, FiCheck, FiRefreshCw, FiX, FiCopy, FiSave
} from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define the content types for the workspace
const contentTypes = [
  { id: 'brand', name: 'Brand Voice', icon: <FiMessageSquare />, count: 1 },
  { id: 'cta', name: 'CTAs & Buttons', icon: <FiFileText />, count: 12 },
  { id: 'error', name: 'Error Messages', icon: <FiAlertCircle />, count: 8 },
  { id: 'form', name: 'Form Labels', icon: <FiMessageSquare />, count: 15 },
  { id: 'tooltip', name: 'Tooltips', icon: <FiHelpCircle />, count: 6 },
];

// Mock content items (these would come from the database in a real app)
const mockContentItems = [
  {
    id: '1',
    type: 'cta',
    label: 'Primary CTA Button',
    content: 'Get Started Now',
    context: 'Homepage hero section',
    lastEdited: '2 hours ago',
    editor: 'You'
  },
  {
    id: '2',
    type: 'cta',
    label: 'Secondary Action',
    content: 'Learn More',
    context: 'Feature section',
    lastEdited: '1 day ago',
    editor: 'Alex M.'
  },
  {
    id: '3',
    type: 'error',
    label: 'Payment Error',
    content: 'Your payment couldn\'t be processed. Please check your payment details and try again.',
    context: 'Checkout page',
    lastEdited: '3 days ago',
    editor: 'You'
  },
  {
    id: '4',
    type: 'error',
    label: 'Form Validation',
    content: 'Please enter a valid email address',
    context: 'Sign up form',
    lastEdited: '4 days ago',
    editor: 'Sarah K.'
  },
  {
    id: '5',
    type: 'form',
    label: 'Email Field',
    content: 'Email address',
    context: 'Contact form',
    lastEdited: '1 week ago',
    editor: 'You'
  },
  {
    id: '6',
    type: 'tooltip',
    label: 'Password Requirements',
    content: 'Password must be at least 8 characters and include a number and special character',
    context: 'Sign up form',
    lastEdited: '2 weeks ago',
    editor: 'Jamie L.'
  }
];

// Mock activity feed items
const mockActivities = [
  {
    id: '1',
    user: 'You',
    action: 'updated',
    item: 'Primary CTA Button',
    time: '2 hours ago'
  },
  {
    id: '2',
    user: 'Alex M.',
    action: 'created',
    item: 'New error message',
    time: '1 day ago'
  },
  {
    id: '3',
    user: 'Sarah K.',
    action: 'commented on',
    item: 'Form validation message',
    time: '3 days ago'
  },
  {
    id: '4',
    user: 'Jamie L.',
    action: 'approved',
    item: 'Tooltip content',
    time: '5 days ago'
  },
];

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const { getWorkspaceById, updateWorkspaceFigmaLink } = useWorkspaces();
  const supabase = createClientComponentClient();
  
  // State for the workspace page
  const [activeTab, setActiveTab] = useState('cta');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // New state for brand voice features
  const [brandVoiceDoc, setBrandVoiceDoc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showBrandVoiceModal, setShowBrandVoiceModal] = useState(false);
  const [brandVoiceAttributes, setBrandVoiceAttributes] = useState({
    tone: 'Professional',
    personality: 'Friendly',
    characteristics: ['Clear', 'Concise', 'Helpful'],
    examples: []
  });
  
  // New state for share functionality
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareItemType, setShareItemType] = useState('workspace');
  const [shareItemId, setShareItemId] = useState('');
  
  // New state for notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'mention',
      message: 'Alex mentioned you in a comment',
      time: '10 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'update',
      message: 'Brand voice has been updated',
      time: '2 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'approval',
      message: 'Your content was approved by Sarah',
      time: '1 day ago',
      read: true
    }
  ]);

  // New state for content creation
  const [contentFormData, setContentFormData] = useState({
    type: 'cta',
    label: '',
    context: '',
    toneEmphasis: 'Balanced (match brand voice)',
    generateMultiple: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [figmaLink, setFigmaLink] = useState('');
  const [hasFigmaLink, setHasFigmaLink] = useState(false);
  const [showFigmaLinkInput, setShowFigmaLinkInput] = useState(false);
  const [generatedSuggestions, setGeneratedSuggestions] = useState([]);
  const [showGenerationResults, setShowGenerationResults] = useState(false);
  const [figmaScreenshot, setFigmaScreenshot] = useState('');
  const [figmaLoading, setFigmaLoading] = useState(false);
  const [figmaError, setFigmaError] = useState('');
  const [generationError, setGenerationError] = useState('');

  // Helper function to try fetching a Figma preview
  const fetchFigmaPreview = async (figmaLink) => {
    if (!figmaLink) {
      return null;
    }
    
    try {
      // Extract the file key from Figma link using simplified logic
      let fileKey = null;
      let nodeId = null;
      
      // Standard file link: figma.com/file/{fileID}/
      const fileRegex = /figma\.com\/file\/([a-zA-Z0-9]+)\//;
      const fileMatch = figmaLink.match(fileRegex);
      
      // Design link: figma.com/design/{fileID}/
      const designRegex = /figma\.com\/design\/([a-zA-Z0-9]+)\//;
      const designMatch = figmaLink.match(designRegex);
      
      // Proto link: figma.com/proto/{fileID}/
      const protoRegex = /figma\.com\/proto\/([a-zA-Z0-9]+)\//;
      const protoMatch = figmaLink.match(protoRegex);
      
      // Community link: figma.com/community/file/{fileID}/
      const communityRegex = /figma\.com\/community\/file\/([a-zA-Z0-9]+)\//;
      const communityMatch = figmaLink.match(communityRegex);
      
      // Extract node ID if present
      const nodeMatch = figmaLink.match(/node-id=([^&\s]+)/i);
      
      if (fileMatch && fileMatch[1]) {
        fileKey = fileMatch[1];
        console.log('Extracted file key from standard file link:', fileKey);
      } else if (designMatch && designMatch[1]) {
        fileKey = designMatch[1];
        console.log('Extracted file key from design link:', fileKey);
      } else if (protoMatch && protoMatch[1]) {
        fileKey = protoMatch[1];
        console.log('Extracted file key from prototype link:', fileKey);
      } else if (communityMatch && communityMatch[1]) {
        fileKey = communityMatch[1];
        console.log('Extracted file key from community link:', fileKey);
      } else {
        throw new Error('Could not extract Figma file key from link. Please use a valid Figma link.');
      }
      
      // Extract node ID if present
      if (nodeMatch && nodeMatch[1]) {
        nodeId = nodeMatch[1];
        console.log('Extracted node ID:', nodeId);
      }
      
      console.log('Fetching Figma preview for:', { fileKey, nodeId });
      
      // Check environment first to see if we have API keys
      const envCheckResponse = await fetch('/api/check-env');
      const envData = await envCheckResponse.json();
      const shouldUseDevMode = envData.figmaTokenStatus !== 'Set';
      
      // Construct the proper URL with query parameters
      const apiUrl = new URL('/api/figma-preview', window.location.origin.toString());
      apiUrl.searchParams.append('fileKey', fileKey || '');
      if (nodeId) {
        apiUrl.searchParams.append('nodeId', nodeId);
      }
      if (shouldUseDevMode) {
        apiUrl.searchParams.append('devMode', 'true');
      }
      
      console.log('Making request to:', apiUrl.toString());
      
      // Call our API endpoint to get the image
      const response = await fetch(apiUrl.toString());
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: `HTTP error ${response.status}` };
        }
        
        // Handle specific error types
        if (response.status === 401 && errorData.requiresConfig) {
          throw new Error('Figma API token is not configured. Please add it to your environment settings.');
        } else if (response.status === 404) {
          throw new Error('Figma file not found. Please check the link and make sure the file exists.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Make sure the Figma file is shared with the correct permissions.');
        } else if (response.status === 429) {
          throw new Error('Figma API rate limit exceeded. Please try again later.');
        }
        
        console.error('Figma API error:', errorData);
        throw new Error(errorData.error || 'Failed to load Figma preview');
      }
      
      const data = await response.json();
      
      // Fallback to thumbnail URL if needed
      if (!data.imageUrl && !data.image) {
        return `https://www.figma.com/file/${fileKey}/thumbnail`;
      }
      
      return data.imageUrl || data.image;
    } catch (error) {
      console.error('Error fetching Figma preview:', error);
      throw error; // Propagate the error to be handled by the caller
    }
  };

  // Helper function to generate copy using the API
  const generateCopy = async (formData, workspaceId) => {
    try {
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to generate copy');
      }
      
      // Check environment first to see if we have API keys
      const envCheckResponse = await fetch('/api/check-env');
      const envData = await envCheckResponse.json();
      const shouldUseDevMode = envData.openaiKeyStatus !== 'Set';
      
      // Create the request payload with Figma link data if available
      const payload = {
        workspaceId,
        type: formData.type,
        tone: formData.toneEmphasis.toLowerCase().includes('professional') ? 'professional' : 
              formData.toneEmphasis.toLowerCase().includes('conversational') ? 'conversational' : 
              formData.toneEmphasis.toLowerCase().includes('persuasive') ? 'persuasive' : 
              formData.toneEmphasis.toLowerCase().includes('concise') ? 'concise' : 'balanced',
        context: formData.context,
        elementName: formData.label,
        elementType: formData.type,
        // Include Figma design link data if available
        elementData: figmaLink ? { figmaLink } : undefined,
        // Only enable dev mode if needed
        ...(shouldUseDevMode && { devMode: true })
      };
      
      console.log('Sending copy generation request:', payload);
      
      // Make the API request with authentication
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API response error:', data);
        
        // Handle specific error types
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (data.code === 'insufficient_quota') {
          throw new Error('API quota exceeded. Please check your billing details.');
        } else if (data.requiresConfig) {
          throw new Error('OpenAI API key is not properly configured. Please check your environment settings.');
        } else {
          throw new Error(data.error || 'Failed to generate copy');
        }
      }
      
      console.log('API response:', data);
      
      return data.suggestions || []; // Ensure it returns an array
    } catch (error) {
      console.error('Error generating copy:', error);
      throw error; // Propagate the error to be handled by the caller
    }
  };

  // Type assertion after initialization to maintain type safety
  const typedSelectedItem = selectedItem as string | null;
  
  // Get workspace data from context
  const workspace = getWorkspaceById(workspaceId);

  // Check if Figma link exists in workspace
  useEffect(() => {
    if (workspace && workspace.figmaLink) {
      setFigmaLink(workspace.figmaLink);
      setHasFigmaLink(true);
    } else {
      setHasFigmaLink(false);
    }
  }, [workspace]);

  // Fetch Figma preview whenever figmaLink changes
  useEffect(() => {
    const loadFigmaPreview = async () => {
      if (figmaLink) {
        setFigmaLoading(true);
        setFigmaError('');
        try {
          const previewUrl = await fetchFigmaPreview(figmaLink);
          if (previewUrl) {
            setFigmaScreenshot(previewUrl);
          } else {
            setFigmaError('No preview available for this Figma file.');
          }
        } catch (error: any) {
          console.error('Error in Figma preview loading:', error);
          // Use the error message directly if it's from our error handling
          setFigmaError(error.message || 'Error loading Figma preview. Please check the link and your API configuration.');
        } finally {
          setFigmaLoading(false);
        }
      } else {
        setFigmaScreenshot('');
        setFigmaError('');
      }
    };

    loadFigmaPreview();
  }, [figmaLink]);

  // Handle content form input changes
  const handleContentFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setContentFormData({
      ...contentFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle Figma link input
  const handleFigmaLinkChange = (e: any) => {
    setFigmaLink(e.target.value);
    // Reset error when user changes the input
    setFigmaError('');
  };

  // Filter content items based on active tab
  const filteredContent = mockContentItems.filter(item => item.type === activeTab);

  // Handle clicking on a content item
  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
  };

  // Get the selected item data
  const selectedItemData = typedSelectedItem 
    ? mockContentItems.find(item => item.id === typedSelectedItem) 
    : null;

  // If the workspace doesn't exist, show an error state
  if (!workspace) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader isLoggedIn={true} />
        
        <div className="fixed-layout">
          <SidebarNav />
          
          <main className="flex-grow overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="mb-6 px-6 pt-6">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => router.push('/workspaces')}
                  className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                  whileHover={{ x: -5 }}
                >
                  <span className="mr-2"><FiArrowLeft size={16} /></span>
                  <span>Back to Workspaces</span>
                </motion.button>
              </div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-6"
              >
                <h1 className="text-2xl font-bold mb-6">Workspace Not Found</h1>
                <p>The workspace you're looking for doesn't exist.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary mt-4"
                  onClick={() => router.push('/workspaces')}
                >
                  Back to Workspaces
                </motion.button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    );
  }
  
  // Handle form submission for content generation
  const handleGenerateContent = async (e: any) => {
    e.preventDefault();
    if (isGenerating) return;
    
    // Basic validation
    if (!contentFormData.label.trim()) {
      alert("Please enter a label for your content");
      return;
    }
    
    setIsGenerating(true);
    setGenerationError('');
    
    try {
      // Update the Figma link if it has changed or was newly added
      if ((!hasFigmaLink || showFigmaLinkInput) && figmaLink.trim()) {
        try {
          await updateWorkspaceFigmaLink(workspaceId, figmaLink.trim());
          setHasFigmaLink(true);
          setShowFigmaLinkInput(false);
        } catch (error) {
          console.error("Error updating Figma link:", error);
          // Continue with generation even if Figma link update fails
        }
      }
      
      // Make the API call to generate copy
      const suggestions = await generateCopy(contentFormData, workspaceId);
      
      // Store the generated suggestions
      setGeneratedSuggestions(suggestions);
      
      // Add notification
      const newNotification = {
        id: (notifications.length + 1).toString(),
        type: 'update',
        message: 'New content was created successfully',
        time: 'Just now',
        read: false
      };
      setNotifications([newNotification, ...notifications]);
      
      // Show generation results panel
      setShowGenerationResults(true);
      
      // Close the modal
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Generation failed:', error);
      setGenerationError(error.message || 'Failed to generate copy. Please try again.');
      
      // Don't show results panel on error
      setShowGenerationResults(false);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <SidebarNav />
        
        <main className="flex-grow overflow-y-auto">
          {/* Top navigation with back button and actions */}
          <div className="border-b bg-white sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push('/workspaces')}>Workspaces</span>
                <span className="mx-2">•</span>
                <span className="text-gray-700 font-medium">{workspace.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
              <motion.button
                onClick={() => router.push('/workspaces')}
                    className="flex items-center justify-center h-9 w-9 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-4"
                    whileHover={{ scale: 1.05 }}
              >
                    <FiArrowLeft size={18} />
              </motion.button>
                  
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{workspace.name}</h1>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500 mr-3">{workspace.description}</p>
                      {brandVoiceDoc ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                          Brand Voice Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                          No Brand Voice
                        </span>
                      )}
            </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block">
                    <div className="bg-primary-50 px-3 py-2 rounded-lg text-sm text-primary-700 border border-primary-100">
                      <span className="font-medium">Welcome back!</span> Ready to polish your copy?
                    </div>
                  </div>
                
                  <div className="relative">
                    <button 
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all relative"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </button>
                    
                    <NotificationsDropdown 
                      isOpen={showNotifications}
                      onClose={() => setShowNotifications(false)}
                      notifications={notifications}
                      onMarkAsRead={(id) => {
                        if (id === 'all') {
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                        } else {
                          setNotifications(notifications.map(n => 
                            n.id === id ? { ...n, read: true } : n
                          ));
                        }
                      }}
                    />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    onClick={() => {
                      setShareItemType('workspace');
                      setShareItemId(workspaceId);
                      setShowShareModal(true);
                    }}
                  >
                    <FiShare2 size={18} />
                  </motion.button>
                  
                  {!brandVoiceDoc ? (
                    <></>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                      onClick={() => setActiveTab('brand')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </motion.button>
                  )}
                  
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    className="btn-outline flex items-center text-sm border-primary text-primary"
                    onClick={() => setShowBrandVoiceModal(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Set Brand Voice
                </motion.button>
                  
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center text-sm px-4 py-2 shadow-sm"
                    onClick={() => {
                      setShowCreateModal(true);
                      // Reset the screenshot when opening a new modal
                      setFigmaScreenshot('');
                    }}
                >
                    <FiPlus className="mr-2" size={16} />
                    New Content
                </motion.button>
              </div>
              </div>
            </div>
            
            {/* Horizontal tabs below workspace header */}
            <div className="border-t shadow-sm relative z-20">
              <nav className="flex overflow-x-auto pb-1 w-full">
                {contentTypes.map((type, index) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`flex items-center justify-center px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-w-[120px] ${
                      index < contentTypes.length - 1 ? 'border-r border-gray-100' : ''
                    } ${
                      activeTab === type.id 
                        ? 'border-b-primary text-primary bg-primary-50/30 font-semibold' 
                        : 'border-b-transparent text-gray-500 hover:text-gray-700 hover:border-b-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-md mr-2 ${activeTab === type.id ? 'bg-primary-50' : ''}`}>
                        {type.icon}
                      </span>
                      <span>{type.name}</span>
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        activeTab === type.id
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {type.count}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main content area with simplified layout (no left sidebar) */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="bg-blue-50 border-b border-blue-100">
                <div className="container mx-auto p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-900">Personalized Insight</h3>
                      <p className="text-blue-700 text-sm">
                        {activeTab === 'brand' 
                          ? "Your brand voice is well-defined! Want to apply this voice to all your content?"
                          : activeTab === 'cta' 
                            ? "CTAs match your voice perfectly! Want to apply this voice to your tooltips too?"
                            : activeTab === 'tooltip'
                              ? "Your tooltips could better match your brand voice. Consider regenerating them."
                              : `Your ${activeTab === 'error' ? 'error messages' : 'form labels'} are almost perfect! Want to apply this tone more consistently?`
                        }
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200">
                        Apply Now
                      </button>
                      <button className="px-3 py-1.5 text-blue-600 text-sm hover:underline">
                        See affected content
                      </button>
                      <button className="p-1 text-blue-400 hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="container mx-auto p-4">
                {activeTab === 'brand' ? (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg">Brand Voice Profile</h3>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          Active
                        </div>
                      </div>
                      
                      {brandVoiceDoc ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Brand Document Analyzed</p>
                              <p className="text-sm text-gray-500">Last updated: Today</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="border rounded-md p-3">
                              <p className="text-gray-500 mb-1">Tone</p>
                              <p className="font-medium">{brandVoiceAttributes.tone}</p>
                            </div>
                            <div className="border rounded-md p-3">
                              <p className="text-gray-500 mb-1">Personality</p>
                              <p className="font-medium">{brandVoiceAttributes.personality}</p>
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-3 text-sm">
                            <p className="text-gray-500 mb-2">Key Characteristics</p>
                            <div className="flex flex-wrap gap-1">
                              {brandVoiceAttributes.characteristics.map((trait, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                  {trait}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <button className="btn-secondary-sm flex items-center" onClick={() => setShowBrandVoiceModal(true)}>
                              <FiEdit2 size={14} className="mr-1" />
                              Update
                            </button>
                            <div className="text-sm text-gray-500">
                              <span className="text-green-600 font-medium">93%</span> match to content
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-600">No brand voice profile has been set up for this workspace yet.</p>
                          <p className="text-sm text-gray-500">Upload your brand document to analyze your brand voice and apply it to all content in this workspace.</p>
                          
                          {/* Progress indicator */}
                          <div className="mt-2 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-700">Setup Progress</p>
                              <p className="text-xs text-gray-500">Step 1 of 3</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: '33%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Upload your brand document to continue</p>
                          </div>
                          
                          <button className="btn-primary flex items-center" onClick={() => setShowBrandVoiceModal(true)}>
                            <FiPlus size={16} className="mr-2" />
                            Add Brand Voice Profile
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium text-lg mb-4 flex items-center">
                        <span className="bg-primary-100 text-primary-700 p-1.5 rounded-md mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                        AI Voice Generation
                        <div className="group relative inline-block">
                          <span className="ml-2 px-2 py-0.5 text-xs bg-primary-50 text-primary-700 rounded-full border border-primary-100 cursor-help">
                            Powered by GPT-4
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            We use GPT-4 to match and generate content in your brand voice.
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                          </div>
                        </div>
                        <a href="#" className="ml-auto text-xs text-primary hover:text-primary-dark hover:underline flex items-center">
                          Learn how it works
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-5">Generate new copy that matches your brand voice or analyze existing copy for consistency.</p>
                      
                      <div className="space-y-3">
                        <button className="btn-secondary w-full text-left flex items-center p-4 hover:bg-primary-50 hover:border-primary-200 transition-colors group relative overflow-hidden" onClick={() => setShowCreateModal(true)}>
                          <span className="mr-3 text-primary bg-primary-100 p-2 rounded-lg group-hover:bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">Generate New Copy</p>
                            <p className="text-xs text-gray-500">Create content that matches your voice</p>
                          </div>
                          <div className="absolute -bottom-10 -right-10 h-24 w-24 bg-primary-100 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </button>
                        
                        <button className="btn-secondary w-full text-left flex items-center p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors group relative overflow-hidden">
                          <span className="mr-3 text-blue-600 bg-blue-100 p-2 rounded-lg group-hover:bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">Analyze Existing Copy</p>
                            <p className="text-xs text-gray-500">Check for brand voice consistency</p>
                          </div>
                          <div className="absolute -bottom-10 -right-10 h-24 w-24 bg-blue-100 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </button>
                        
                        <button className="btn-secondary w-full text-left flex items-center p-4 hover:bg-green-50 hover:border-green-200 transition-colors group relative overflow-hidden">
                          <span className="mr-3 text-green-600 bg-green-100 p-2 rounded-lg group-hover:bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">Bulk Apply Voice</p>
                            <p className="text-xs text-gray-500">Update all content to match brand voice</p>
                          </div>
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-200 flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></div>
                            New
                          </span>
                          <div className="absolute -bottom-10 -right-10 h-24 w-24 bg-green-100 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg">Voice Consistency</h3>
                        <div className="text-xs text-gray-500">Last analyzed: 2 hours ago</div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-sm">Overall Match</p>
                            <p className="text-green-600 font-medium flex items-center">
                              <span className="text-lg">93%</span>
                              <svg className="h-4 w-4 text-green-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full relative" style={{ width: '93%' }}>
                              <div className="animate-pulse absolute -right-1 -top-1 h-5 w-5 rounded-full bg-white border-2 border-green-500"></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">Excellent consistency across your content!</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-gray-700">CTAs & Buttons</p>
                              <div className="relative h-8 w-8">
                                <svg className="h-8 w-8 text-gray-200" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="4"/>
                                </svg>
                                <svg className="absolute inset-0 h-8 w-8 text-green-500" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeDasharray="100, 100"
                                    strokeDashoffset="3"
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">97%</span>
                              </div>
                            </div>
                            <div className="text-xs text-green-600 mt-1 flex items-center">
                              <svg className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              +2% from last check
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-gray-700">Error Messages</p>
                              <div className="relative h-8 w-8">
                                <svg className="h-8 w-8 text-gray-200" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="4"/>
                                </svg>
                                <svg className="absolute inset-0 h-8 w-8 text-yellow-500" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeDasharray="100, 100"
                                    strokeDashoffset="14"
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">86%</span>
                              </div>
                            </div>
                            <button className="text-xs text-primary hover:text-primary-dark mt-1 flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              Improve matching
                            </button>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-gray-700">Form Labels</p>
                              <div className="relative h-8 w-8">
                                <svg className="h-8 w-8 text-gray-200" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="4"/>
                                </svg>
                                <svg className="absolute inset-0 h-8 w-8 text-green-500" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeDasharray="100, 100"
                                    strokeDashoffset="5"
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">95%</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              8 items checked
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-gray-700">Tooltips</p>
                              <div className="relative h-8 w-8">
                                <svg className="h-8 w-8 text-gray-200" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="4"/>
                                </svg>
                                <svg className="absolute inset-0 h-8 w-8 text-green-500" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeDasharray="100, 100"
                                    strokeDashoffset="7"
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">93%</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              6 items checked
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button className="text-primary text-sm font-medium flex items-center hover:text-primary-dark">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reanalyze All Content
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredContent.length > 0 ? (
                      filteredContent.map((item, index) => (
                        <div 
                          key={item.id} 
                          className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 group relative ${selectedItem === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  item.type === 'template' ? 'bg-green-500' : 
                                  item.type === 'snippet' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}></span>
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{item.label}</h3>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span className="mr-3 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {item.lastEdited}
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {item.type === 'template' ? 'Template' : item.type === 'snippet' ? 'Snippet' : 'Copy'}
                                </span>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <button className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button 
                                  className="p-1 text-gray-400 hover:text-primary rounded-full hover:bg-primary-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShareItemType('content');
                                    setShareItemId(item.id);
                                    setShowShareModal(true);
                                  }}
                                >
                                  <FiShare2 size={18} />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300"></div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No content items yet</p>
                        <button 
                          onClick={() => setShowCreateModal(true)}
                          className="btn-primary-sm inline-flex items-center"
                        >
                          <FiPlus size={14} className="mr-1" />
                          Add {contentTypes.find(t => t.id === activeTab)?.name || 'Content'}
                        </button>
                  </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right panel for details and actions - only show if item selected */}
            {selectedItem && (
              <div className="w-80 overflow-y-auto flex-shrink-0 bg-white border-l">
                <AnimatePresence mode="wait">
                <motion.div 
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Details</h2>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => {
                            if (selectedItemData) {
                              setShareItemType('content');
                              setShareItemId(selectedItemData.id);
                              setShowShareModal(true);
                            }
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <FiShare2 size={16} />
                        </button>
                        <button 
                          onClick={() => setIsEditMode(!isEditMode)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                          <FiTrash2 size={16} />
                        </button>
                  </div>
                    </div>
                    
                    {selectedItemData && (
                      <div className="space-y-4">
                        {isEditMode ? (
                  <div className="space-y-3">
                    <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Label
                              </label>
                              <input
                                type="text"
                                className="input w-full"
                                defaultValue={selectedItemData.label}
                              />
                    </div>
                    <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                              </label>
                              <textarea
                                className="input w-full"
                                rows={4}
                                defaultValue={selectedItemData.content}
                              ></textarea>
                    </div>
                    <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Context
                              </label>
                              <input
                                type="text"
                                className="input w-full"
                                defaultValue={selectedItemData.context}
                              />
                    </div>
                            <div className="flex space-x-2 pt-2">
                              <button 
                                onClick={() => setIsEditMode(false)} 
                                className="btn-secondary flex-1"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => setIsEditMode(false)} 
                                className="btn-primary flex-1"
                              >
                                Save
                              </button>
                  </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm text-gray-500">Label</h3>
                              <p className="font-medium">{selectedItemData.label}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500">Content</h3>
                              <div className="p-3 bg-gray-50 rounded-lg border text-gray-900">
                                {selectedItemData.content}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500">Context</h3>
                              <p>{selectedItemData.context}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500">Last Edited</h3>
                              <p className="flex items-center">
                                <span>{selectedItemData.lastEdited}</span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span>{selectedItemData.editor}</span>
                              </p>
                            </div>
                            <div className="pt-2">
                              <button className="btn-primary w-full">
                                Generate Alternatives
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Create Content Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e: any) => {
              if (e.target === e.currentTarget) {
                setShowCreateModal(false);
              }
            }}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl"
              onClick={(e: any) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-1">Create New Content</h2>
              {brandVoiceDoc && (
                <div className="flex items-center text-sm text-green-700 mb-4">
                  <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Content will be generated matching your brand voice
                </div>
              )}
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select 
                    className="input focus:ring-2 focus:ring-primary transition-all duration-200 w-full"
                    name="type"
                    value={contentFormData.type}
                    onChange={handleContentFormChange}
                  >
                    {contentTypes.filter(type => type.id !== 'brand').map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    name="label"
                    value={contentFormData.label}
                    onChange={handleContentFormChange}
                    className="input focus:ring-2 focus:ring-primary transition-all duration-200 w-full"
                    placeholder="E.g., Primary CTA Button"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Context
                  </label>
                  <textarea
                    name="context"
                    value={contentFormData.context}
                    onChange={handleContentFormChange}
                    className="input focus:ring-2 focus:ring-primary transition-all duration-200 w-full"
                    placeholder="Describe where and how this copy will be used..."
                    rows={3}
                  ></textarea>
                </div>
                
                {/* Figma Link Section - Show when missing or user wants to add/edit */}
                {(!hasFigmaLink || showFigmaLinkInput) && (
                  <div className="border rounded-lg p-3 bg-blue-50 space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-blue-800">Add Figma Design Link</h3>
                        <p className="text-xs text-blue-700 mb-2">
                          Adding a Figma link helps generate more contextual copy
                        </p>
                        <input
                          type="text"
                          value={figmaLink}
                          onChange={handleFigmaLinkChange}
                          className="input text-sm py-1.5 w-full bg-white"
                          placeholder="Paste your Figma file URL here"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {hasFigmaLink && !showFigmaLinkInput && (
                  <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                      </svg>
                      <span className="text-gray-700">Figma design linked</span>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-primary font-medium hover:text-primary-dark"
                      onClick={() => setShowFigmaLinkInput(true)}
                    >
                      Edit
                    </button>
                  </div>
                )}
                
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">AI Generation Options</h3>
                    </div>
                  </div>
                  
                  <div className="ml-8 space-y-3">
                    <div>
                      <label className="flex items-center text-sm">
                        <input 
                          type="checkbox" 
                          name="generateMultiple"
                          checked={contentFormData.generateMultiple}
                          onChange={handleContentFormChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                        />
                        <span className="ml-2 text-gray-700">Generate multiple variations</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Tone emphasis</label>
                      <select 
                        className="input text-sm py-1 w-full"
                        name="toneEmphasis"
                        value={contentFormData.toneEmphasis}
                        onChange={handleContentFormChange}
                      >
                        <option>Balanced (match brand voice)</option>
                        <option>More conversational</option>
                        <option>More professional</option>
                        <option>More persuasive</option>
                        <option>More concise</option>
                      </select>
                    </div>
                    
                    {!brandVoiceDoc && (
                      <div className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-700">No brand voice profile</span>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-blue-700 font-medium hover:text-blue-900"
                          onClick={() => {
                            setShowCreateModal(false);
                            setTimeout(() => setShowBrandVoiceModal(true), 300);
                          }}
                        >
                          Add one
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end space-x-3">
                  <motion.button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="button" 
                    className={`btn-primary flex items-center ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                    whileHover={{ scale: isGenerating ? 1 : 1.05 }}
                    whileTap={{ scale: isGenerating ? 1 : 0.95 }}
                    disabled={isGenerating}
                    onClick={handleGenerateContent}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate Copy
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Brand Voice Analysis Modal */}
      <AnimatePresence>
        {showBrandVoiceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e: any) => {
              if (e.target === e.currentTarget) {
                setShowBrandVoiceModal(false);
              }
            }}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl"
              onClick={(e: any) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-1">Brand Voice Analysis</h2>
              <p className="text-gray-500 text-sm mb-6">Upload your brand documents for AI-powered voice analysis</p>
              
              <div className="space-y-6">
                {!brandVoiceDoc && !isAnalyzing && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                        <span>Upload a file</span>
                  <input
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setBrandVoiceDoc(file);
                              // In a real app, you'd upload the file here
                              setTimeout(() => {
                                setIsAnalyzing(true);
                              }, 500);
                              
                              // Simulate AI analysis completion
                              setTimeout(() => {
                                setIsAnalyzing(false);
                                setBrandVoiceAttributes({
                                  tone: 'Professional & Approachable',
                                  personality: 'Helpful & Knowledgeable',
                                  characteristics: ['Clear', 'Concise', 'Confident', 'Engaging'],
                                  examples: [
                                    'We believe in simplifying complex challenges.',
                                    'Our approach combines innovation with proven expertise.',
                                    'Join thousands of satisfied customers who trust our solutions.'
                                  ]
                                });
                              }, 3500);
                            }
                          }}
                        />
                      </label>
                      <p>or drag and drop</p>
                </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, TXT up to 10MB
                    </p>
                  </div>
                )}
                
                {brandVoiceDoc && isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Analyzing your brand voice</h3>
                    <p className="text-gray-500">Our AI is extracting key characteristics from your document...</p>
                </div>
                )}
                
                {brandVoiceDoc && !isAnalyzing && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary-50 rounded-lg p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {brandVoiceDoc.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Analysis complete
                        </p>
                      </div>
                  <button 
                        className="ml-auto text-gray-400 hover:text-gray-500"
                    onClick={() => {
                          setBrandVoiceDoc(null);
                          setBrandVoiceAttributes({
                            tone: 'Professional',
                            personality: 'Friendly',
                            characteristics: ['Clear', 'Concise', 'Helpful'],
                            examples: []
                          });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                  </button>
                </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="font-medium text-gray-900 mb-3">AI-Detected Brand Voice Attributes</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Tone</h4>
                          <p className="text-sm text-gray-900 mt-1">{brandVoiceAttributes.tone}</p>
            </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Personality</h4>
                          <p className="text-sm text-gray-900 mt-1">{brandVoiceAttributes.personality}</p>
          </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Key Characteristics</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {brandVoiceAttributes.characteristics.map((trait, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Voice Examples</h4>
                        <ul className="mt-2 space-y-2">
                          {brandVoiceAttributes.examples.map((example, index) => (
                            <li key={index} className="text-sm text-gray-900 border-l-4 border-primary-200 pl-3 py-1">
                              "{example}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Brand voice successfully analyzed</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>All future content will now reflect these brand voice attributes. You can now generate content based on this analysis.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  className="btn-secondary"
                    onClick={() => setShowBrandVoiceModal(false)}
                >
                    Close
                </button>
                  {brandVoiceDoc && !isAnalyzing && (
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={() => {
                        setShowBrandVoiceModal(false);
                        // In a real app, you'd save the voice analysis to the workspace
                  }}
                >
                      Apply to Workspace
                </button>
                  )}
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        itemType={shareItemType}
        itemId={shareItemId}
        workspaceName={workspace?.name || ''}
      />
      
      {/* Generation Results Side Panel */}
      <AnimatePresence>
        {showGenerationResults && generatedSuggestions.length > 0 && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-2/5 bg-white border-l border-gray-200 shadow-xl z-50 overflow-auto flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold">Generated Copy Results</h2>
              <button 
                onClick={() => setShowGenerationResults(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto">
              {/* Figma Design Preview */}
              {figmaScreenshot ? (
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Figma Design</h3>
                  <div className="mt-1 overflow-hidden rounded-md">
                    <img 
                      src={figmaScreenshot}
                      alt="Figma Design Preview"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              ) : figmaLoading ? (
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Figma Design</h3>
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading Figma preview...</p>
                    </div>
                  </div>
                </div>
              ) : figmaError ? (
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Figma Design</h3>
                  <div className="p-4 bg-red-50 rounded border border-red-100">
                    <p className="text-sm text-red-600">{figmaError}</p>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <p>To fix this issue:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Make sure your Figma file is shared with "Anyone with the link" permission</li>
                        <li>Copy the link directly from the Share button in Figma</li>
                        <li>Try using the main file link rather than a specific frame</li>
                        <li>Use the format: https://www.figma.com/file/FILEID/FILENAME</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Figma Design</h3>
                  <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded text-center">
                    <p className="text-gray-500">No Figma preview available</p>
                    <p className="text-xs text-gray-400 mt-1">Connect Figma to see design context</p>
                  </div>
                </div>
              )}
              
              {/* Generated Suggestions */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Generated Suggestions</h3>
                <div className="space-y-3">
                  {generatedSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-white border border-gray-200 rounded-md hover:border-primary hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{suggestion}</p>
                        <div className="flex items-center space-x-2">
                          <button 
                            className="p-1.5 text-gray-500 hover:text-primary rounded hover:bg-gray-100"
                            title="Copy to clipboard"
                            onClick={() => {
                              navigator.clipboard.writeText(suggestion);
                              alert('Copied to clipboard!');
                            }}
                          >
                            <FiCopy size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-gray-500 hover:text-green-600 rounded hover:bg-gray-100"
                            title="Use this suggestion"
                          >
                            <FiCheck size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between">
                <button
                  className="btn-secondary text-sm px-3 py-1.5"
                  onClick={() => setShowGenerationResults(false)}
                >
                  Close
                </button>
                <div className="flex space-x-2">
                  <button
                    className="btn-outline text-sm px-3 py-1.5 border-primary text-primary"
                    onClick={() => {
                      // In a real app, you'd regenerate with different params
                      alert('Regenerate functionality would be implemented here');
                    }}
                  >
                    <FiRefreshCw size={14} className="mr-1.5" />
                    Regenerate
                  </button>
                  <button
                    className="btn-primary text-sm px-3 py-1.5"
                    onClick={() => {
                      // In a real app, you'd save this to history
                      alert('Save to history functionality would be implemented here');
                      setShowGenerationResults(false);
                    }}
                  >
                    <FiSave size={14} className="mr-1.5" />
                    Save to History
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <NotificationsDropdown
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          if (id === 'all') {
            setNotifications(notifications.map(n => ({ ...n, read: true })));
          } else {
            setNotifications(notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            ));
          }
        }}
      />
                </div>
  );
}

// Add ShareModal component
function ShareModal({ isOpen, onClose, itemType, itemId, workspaceName }) {
  const [shareOption, setShareOption] = useState('link');
  const [permissions, setPermissions] = useState('view');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const shareLink = `https://copysnap.app/share/${itemType}/${itemId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = () => {
    // In a real app, this would send an API request to share the content
    console.log(`Sharing ${itemType} with ${email} (${permissions})`);
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e: any) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(e: any) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Share {itemType === 'workspace' ? workspaceName : 'Content'}
            </h2>
            
            <div className="mb-6">
              <div className="flex border rounded-md overflow-hidden mb-4">
                  <button 
                  className={`flex-1 py-2 px-4 text-sm ${shareOption === 'link' ? 'bg-primary-50 text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                  onClick={() => setShareOption('link')}
                  >
                  Get Link
                  </button>
                  <button 
                  className={`flex-1 py-2 px-4 text-sm ${shareOption === 'email' ? 'bg-primary-50 text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                  onClick={() => setShareOption('email')}
                >
                  Invite People
                  </button>
                </div>
              
              {shareOption === 'link' ? (
                <div className="space-y-4">
                  <div className="flex items-center p-2 bg-gray-50 rounded-md border">
                    <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                      {shareLink}
                    </span>
                    <button 
                      className="p-2 bg-white rounded-md border text-gray-600 hover:text-primary hover:border-primary transition-colors"
                      onClick={handleCopyLink}
                    >
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link permissions
                  </label>
                    <select 
                      className="input w-full"
                      value={permissions}
                      onChange={(e) => setPermissions(e.target.value)}
                    >
                      <option value="view">Anyone with the link can view</option>
                      <option value="edit">Anyone with the link can edit</option>
                      <option value="comment">Anyone with the link can comment</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add people by email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="input w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                  </label>
                    <select 
                      className="input w-full"
                      value={permissions}
                      onChange={(e) => setPermissions(e.target.value)}
                    >
                      <option value="view">Can view</option>
                      <option value="edit">Can edit</option>
                      <option value="admin">Admin</option>
                  </select>
                  </div>
                </div>
              )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    className="btn-secondary"
                onClick={onClose}
                  >
                    Cancel
                  </button>
              {shareOption === 'email' && (
                  <button 
                    className="btn-primary"
                  onClick={handleShare}
                  disabled={!email}
                >
                  Share
                  </button>
              )}
                </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add NotificationsDropdown component
function NotificationsDropdown({ isOpen, onClose, notifications, onMarkAsRead }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                className="text-xs text-primary hover:text-primary-dark font-medium"
                onClick={() => onMarkAsRead('all')}
              >
                Mark all as read
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-primary-50' : ''}`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        {notification.type === 'mention' && (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                            <FiUser size={16} />
          </div>
        )}
                        {notification.type === 'update' && (
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            <FiRefreshCw size={16} />
    </div>
                        )}
                        {notification.type === 'approval' && (
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                            <FiCheck size={16} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      
                      {!notification.read && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200 text-center">
            <button
              className="text-sm text-primary hover:text-primary-dark font-medium w-full"
              onClick={() => {
                // In a real app, this would navigate to notifications page
                onClose();
              }}
            >
              View all notifications
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 

