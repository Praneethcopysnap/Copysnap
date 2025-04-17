'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Info, CheckCircle, Zap } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface WorkspaceSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    figma_link?: string;
    brand_voice_file?: string;
    tone?: string;
    style?: string;
    voice?: string;
    persona_description?: string;
  }) => void;
  isSubmitting: boolean;
  title: string;
}

type TonePreset = 'friendly' | 'professional' | 'playful' | 'minimal';

interface PresetValues {
  tone: string;
  style: string;
  voice: string;
}

const TONE_PRESETS: Record<TonePreset, PresetValues> = {
  friendly: { tone: '30', style: '50', voice: '30' },
  professional: { tone: '80', style: '60', voice: '70' },
  playful: { tone: '20', style: '70', voice: '20' },
  minimal: { tone: '60', style: '20', voice: '50' }
};

const WorkspaceSidePanel = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  title
}: WorkspaceSidePanelProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [figmaLink, setFigmaLink] = useState('');
  const [figmaValid, setFigmaValid] = useState(false);
  const [brandVoiceFile, setBrandVoiceFile] = useState(null as File | null);
  const [useAI, setUseAI] = useState(false);
  const [tone, setTone] = useState('50');
  const [style, setStyle] = useState('50');
  const [voice, setVoice] = useState('50');
  const [selectedPreset, setSelectedPreset] = useState('' as TonePreset | '');
  const [personaDescription, setPersonaDescription] = useState('');
  const fileInputRef = useRef(null as HTMLInputElement | null);

  // Validate Figma link when it changes
  useEffect(() => {
    // Simple validation - check if it's a figma.com URL
    if (figmaLink && figmaLink.includes('figma.com')) {
      setFigmaValid(true);
    } else {
      setFigmaValid(false);
    }
  }, [figmaLink]);

  const handlePresetChange = (preset: TonePreset | '') => {
    setSelectedPreset(preset);
    
    if (preset && TONE_PRESETS[preset]) {
      const { tone: newTone, style: newStyle, voice: newVoice } = TONE_PRESETS[preset];
      setTone(newTone);
      setStyle(newStyle);
      setVoice(newVoice);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      let brandVoiceFilePath;
      
      // Upload the file first if there is one
      if (brandVoiceFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', brandVoiceFile);
        
        // Get current session directly
        const supabase = createClientComponentClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('No active session for file upload:', sessionError);
          alert('Authentication error. Please log in again.');
          return;
        }
        
        // Get access token from the current session
        const accessToken = session.access_token;
        console.log('Uploading file with valid authorization token');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: fileFormData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload file');
        }
        
        const { filePath } = await uploadResponse.json();
        brandVoiceFilePath = filePath;
      }
      
      // Then submit the workspace data with the file path
      onSubmit({
        name,
        description,
        figma_link: figmaLink,
        brand_voice_file: brandVoiceFilePath || undefined,
        tone: useAI ? tone : undefined,
        style: useAI ? style : undefined,
        voice: useAI ? voice : undefined,
        persona_description: useAI ? personaDescription : undefined
      });
    } catch (error) {
      console.error('Error creating workspace:', error);
      // You can add error handling UI here
      alert('There was an error uploading your file. Please try again.');
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setBrandVoiceFile(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const panelVariants = {
    hidden: { x: '100%' },
    visible: { x: '0%' },
    exit: { x: '100%' }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      {/* Background overlay */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Sliding panel */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={panelVariants}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-[85%] md:w-[70%] max-w-3xl bg-white shadow-xl z-50 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Panel header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Panel content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Workspace Details Section */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Workspace Details
              </h3>
              <div className="space-y-6">
                {/* Name input */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Workspace Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter workspace name"
                    className="input-field w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                
                {/* Description input */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your workspace's purpose"
                    className="input-field w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                
                {/* Figma link input */}
                <div className="space-y-2">
                  <label htmlFor="figmaLink" className="block text-sm font-medium text-gray-700">
                    Figma Link (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="figmaLink"
                      type="url"
                      value={figmaLink}
                      onChange={(e) => setFigmaLink(e.target.value)}
                      placeholder="Paste your Figma file link"
                      className={`input-field w-full rounded-lg border ${figmaValid ? 'border-green-400' : 'border-gray-300'} px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-10`}
                    />
                    {figmaValid && (
                      <CheckCircle size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Linking a Figma file allows CopySnap to reference your designs.
                  </p>
                </div>
                
                {/* Brand voice file upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Brand Voice Document (Optional)
                  </label>
                  <div
                    onClick={triggerFileUpload}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    
                    {brandVoiceFile ? (
                      <div className="flex items-center justify-center space-x-2 text-primary">
                        <CheckCircle size={20} />
                        <span className="font-medium">{brandVoiceFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2 text-gray-500">
                        <Upload size={24} />
                        <span>Click to upload your brand voice document</span>
                        <span className="text-xs">PDF, DOC, DOCX or TXT (Max 10MB)</span>
                        <p className="text-xs text-gray-500 mt-2 max-w-md">
                          We'll use this to understand tone, vocabulary, and do's/don'ts for copywriting.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Settings Section */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                AI Settings
              </h3>
              
              {/* AI toggle */}
              <div className="flex items-center justify-between py-3 mb-5 px-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Use AI settings</span>
                  <div className="relative group">
                    <Info size={16} className="text-gray-400 cursor-help" />
                    <div className="absolute left-0 -top-2 transform -translate-y-full w-64 p-2 bg-gray-800 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      These settings help AI generate copy that matches your brand's voice
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useAI}
                    onChange={() => setUseAI(!useAI)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {useAI && (
                <>
                  <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-md mb-6 text-sm">
                    <p>We'll use your brand voice, tone, and persona to generate better UX copy throughout your workspace.</p>
                  </div>
                  
                  <div className="space-y-6 p-5 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    {/* Preset selector */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Preset Tone
                      </label>
                      <select 
                        value={selectedPreset}
                        onChange={(e) => handlePresetChange(e.target.value as TonePreset | '')}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="">Choose a preset (optional)</option>
                        <option value="friendly">Friendly & Approachable</option>
                        <option value="professional">Professional & Authoritative</option>
                        <option value="playful">Playful & Creative</option>
                        <option value="minimal">Minimal & Direct</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        Select a preset or customize sliders below
                      </p>
                    </div>
                    
                    {/* Tone Slider */}
                    <div className="space-y-2">
                      <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                        Brand Tone
                      </label>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Friendly</span>
                        <span>Formal</span>
                      </div>
                      <input
                        type="range"
                        id="tone"
                        name="tone"
                        min="0"
                        max="100"
                        value={tone}
                        onChange={(e) => {
                          setTone(e.target.value);
                          setSelectedPreset('');
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    
                    {/* Style Slider */}
                    <div className="space-y-2">
                      <label htmlFor="style" className="block text-sm font-medium text-gray-700">
                        Writing Style
                      </label>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Brief</span>
                        <span>Descriptive</span>
                      </div>
                      <input
                        type="range"
                        id="style"
                        name="style"
                        min="0"
                        max="100"
                        value={style}
                        onChange={(e) => {
                          setStyle(e.target.value);
                          setSelectedPreset('');
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    
                    {/* Voice Slider */}
                    <div className="space-y-2">
                      <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
                        Brand Voice
                      </label>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Human</span>
                        <span>Professional</span>
                      </div>
                      <input
                        type="range"
                        id="voice"
                        name="voice"
                        min="0"
                        max="100"
                        value={voice}
                        onChange={(e) => {
                          setVoice(e.target.value);
                          setSelectedPreset('');
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    
                    {/* Persona description */}
                    <div className="space-y-2">
                      <label htmlFor="personaDescription" className="block text-sm font-medium text-gray-700">
                        Brand Persona
                      </label>
                      <textarea
                        id="personaDescription"
                        value={personaDescription}
                        onChange={(e) => setPersonaDescription(e.target.value)}
                        placeholder="Describe your brand persona (e.g., 'A helpful expert who simplifies complex topics')"
                        className="input-field w-full min-h-[80px] rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
        
        {/* Panel footer with action buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white font-medium bg-primary hover:bg-primary-dark rounded-md transition-colors flex items-center space-x-2 disabled:bg-primary-light disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting || !name || !description}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                <span>Creating...</span>
              </>
            ) : (
              <>
                {useAI ? (
                  <>
                    <Zap size={16} className="text-white" />
                    <span>Create & Enable AI Copying</span>
                  </>
                ) : (
                  <span>Create Workspace</span>
                )}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default WorkspaceSidePanel; 