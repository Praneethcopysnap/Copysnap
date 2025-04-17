'use client';

import React, { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SiteHeader from './components/SiteHeader'
import { FiArrowRight, FiCheck, FiX, FiUser, FiLayers, FiCpu, FiEdit, FiCopy, FiExternalLink } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ChevronDown, 
  ExternalLink, 
  Sparkles, 
  Play, 
  Check, 
  ArrowRight,
  Copy,
  Eye,
  FolderOpen,
  Info,
  AlertCircle,
  CheckCircle,
  Zap,
  Sliders,
  Puzzle,
  User2
} from 'lucide-react'
import { FcGoogle } from 'react-icons/fc';
import { FaArrowRight, FaArrowDown, FaCrown, FaCheck } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import { FiMenu, FiLayout, FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

// Type definitions
type ToastType = 'success' | 'error';

// Mock data for demo widget
const mockFrames = [
  { id: 'frame1', name: 'Login Form' },
  { id: 'frame2', name: 'Checkout Button' },
  { id: 'frame3', name: 'Error Message' },
  { id: 'frame4', name: 'Empty State' },
  { id: 'frame5', name: 'Success Modal' }
];

const mockGeneratedCopy = {
  'frame1': [
    'Welcome back, sign in to continue',
    'Log in to your account',
    'Sign in to access your dashboard'
  ],
  'frame2': [
    'Complete purchase',
    'Proceed to checkout',
    'Place order securely'
  ],
  'frame3': [
    'Something went wrong. Please try again.',
    'We encountered an error processing your request.',
    'Unable to complete action. Please retry.'
  ],
  'frame4': [
    'No items found. Start by adding something to your collection.',
    'Your library is empty. Begin creating content.',
    'Nothing here yet. Get started by creating your first item.'
  ],
  'frame5': [
    'Success! Your changes have been saved.',
    'All done! Your action was completed successfully.',
    'Great work! Your task has been completed.'
  ]
};

// Mock testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Design Lead",
    company: "Dropstack",
    title: "Design Lead at Dropstack",
    quote: "CopySnap has transformed our design-to-copy workflow. What used to take days of back-and-forth now happens instantly.",
    avatar: ""
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "UX Writer",
    company: "Waveline",
    title: "UX Writer at Waveline",
    quote: "I can focus on strategic messaging while CopySnap handles all the UI copy. It's like having a specialized writing assistant.",
    avatar: ""
  },
  {
    id: 3,
    name: "Jamie Patel",
    role: "Product Manager",
    company: "Sequence",
    title: "Product Manager at Sequence",
    quote: "The speed at which we can iterate on copy has shortened our release cycles by 40%. Game-changer for our product team.",
    avatar: ""
  }
];

// Enhanced button component with animation
const AnimatedButton = ({ 
  children, 
  onClick, 
  className, 
  disabled = false 
}: { 
  children: any, 
  onClick?: () => void, 
  className: string,
  disabled?: boolean 
}) => (
  <motion.button
    className={className}
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? {} : { scale: 1.03 }}
    whileTap={disabled ? {} : { scale: 0.97 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    {children}
  </motion.button>
);

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string, type: ToastType, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 z-50 py-3 px-5 rounded-md shadow-md flex items-center space-x-2 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      <div className="p-1 bg-white bg-opacity-25 rounded-full">
        {type === 'success' ? (
          <FiCheck className="text-white" />
        ) : (
          <FiX className="text-white" />
        )}
      </div>
      <p className="font-medium">{message}</p>
    </motion.div>
  );
};

// Missing components
const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
      </div>
    </div>
  </div>
)

// Memoized GeneratedResults component to prevent unnecessary re-renders
const GeneratedResults = React.memo(({ currentCopy }: { currentCopy: string[] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const handleCopyClick = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return currentCopy.length > 0 ? (
    <div className="space-y-3">
      {currentCopy.map((copy, index) => (
        <motion.div 
          key={index}
          className="p-4 border rounded-lg hover:border-primary cursor-pointer group relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          onClick={() => handleCopyClick(copy, index)}
        >
          <p className="pr-8">{copy}</p>
          <span className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {copiedIndex === index ? (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <FiCheck className="text-green-500" />
              </motion.div>
            ) : (
              <FiCopy className="text-gray-400" />
            )}
          </span>
        </motion.div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-center py-8">
      Click "Generate Copy" to see AI-powered suggestions
    </p>
  );
});

export default function Home() {
  const router = useRouter();
  const defaultFrameId = mockFrames[0]?.id || '';
  const [selectedFrame, setSelectedFrame] = useState(defaultFrameId);
  const [generatedCopy, setGeneratedCopy] = useState(mockGeneratedCopy[defaultFrameId] || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('designers');
  const [showStickyBanner, setShowStickyBanner] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as ToastType
  });
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Refs for smooth scrolling
  const demoRef = useRef(null);
  const waitlistRef = useRef(null);
  
  // Update generatedCopy when selectedFrame changes
  useEffect(() => {
    setGeneratedCopy(mockGeneratedCopy[selectedFrame]);
  }, [selectedFrame]);
  
  // Scroll listener for sticky banner
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = (scrollPosition / (pageHeight - windowHeight)) * 100;
      
      if (scrollPercent > 25) {
        setShowStickyBanner(true);
      } else {
        setShowStickyBanner(false);
      }
    };
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Smooth scroll function
  const scrollToRef = (ref: any) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle anchor links with smooth scrolling
  const handleAnchorClick = (e: any, target: string) => {
    e.preventDefault();
    if (target === '#demo') {
      scrollToRef(demoRef);
    } else if (target === '#waitlist') {
      scrollToRef(waitlistRef);
    }
  };
  
  // Mock copy generation with enhanced functionality
  const handleGenerateCopy = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setGeneratedCopy(mockGeneratedCopy[selectedFrame]);
      setIsGenerating(false);
      setToast({
        show: true,
        message: 'Copy suggestions generated successfully!',
        type: 'success'
      });
    }, 1000);
  };
  
  // Regenerate functionality
  const handleRegenerate = () => {
    // In a real app, this would generate slightly different variations
    // For now, we'll just show the same results but with a loading delay
    setIsGenerating(true);
    
    setTimeout(() => {
      setGeneratedCopy(mockGeneratedCopy[selectedFrame]);
      setIsGenerating(false);
      setToast({
        show: true,
        message: 'New copy suggestions generated!',
        type: 'success'
      });
    }, 800);
  };
  
  // Toast handling
  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };
  
  // Add scroll effect for parallax elements
  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scrollY', `${window.scrollY}px`);
    };
    
    // Set initial scroll position
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Demo Widget Section with enhanced UI
  const DemoSection = () => (
    <section id="demo" ref={demoRef} className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Try It Yourself</h2>
          <p className="text-center text-lg mb-12 max-w-2xl mx-auto text-gray-600">
            See how CopySnap generates contextual copy based on your Figma frames.
          </p>
        </motion.div>
        
          <motion.div
          className="bg-white rounded-lg shadow-lg border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gray-50 border-b px-6 py-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-gray-500 ml-2">CopySnap Figma Plugin</span>
              </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="frameSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select Figma Frame
              </label>
              <select
                id="frameSelect"
                className="input w-full focus:ring-primary focus:border-primary transition-all"
                value={selectedFrame}
                onChange={(e) => setSelectedFrame(e.target.value)}
              >
                {mockFrames.map(frame => (
                  <option key={frame.id} value={frame.id}>{frame.name}</option>
                ))}
              </select>
            </div>
            
            <AnimatedButton
              className={`btn-primary w-full mb-6 flex items-center justify-center ${isGenerating ? 'opacity-90' : ''}`}
              onClick={handleGenerateCopy}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : 'Generate Copy'}
            </AnimatedButton>
            
            <div className="border-t pt-6">
              <h3 className="font-bold mb-4">Generated Copy Suggestions:</h3>
              <p className="text-sm text-gray-500 mb-4">Click on a suggestion to copy it to clipboard</p>
              
              {isGenerating ? (
                <LoadingSpinner />
              ) : (
                <GeneratedResults currentCopy={generatedCopy} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
  
  // Handle scroll for animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <SiteHeader />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={closeToast} 
          />
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-36 lg:pt-40 pb-16 w-full overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left side content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                  <Sparkles size={14} className="mr-2" />
                  <span className="text-sm font-medium">AI-Powered UX Copy Generator</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                  Context-Aware UX Copy.{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Instantly.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 max-w-2xl mt-4">
                  Generate smarter UX copy directly from your designs — with brand voice, tone, and user persona baked in.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.a
                  href="https://www.figma.com/community/plugin/copysnap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
                  whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M8 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"></path>
                    <path d="M15.5 12a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0z"></path>
                    <path d="M12 8.5a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z"></path>
                    <path d="M15.5 20a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0z"></path>
                    <path d="M8 8.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"></path>
                  </svg>
                  Install Figma Plugin
                </motion.a>
                
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-800 font-medium border border-gray-200 hover:border-gray-300"
                  whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Copy size={18} />
                  Start Generating Copy
                </motion.button>
              </motion.div>
              
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center gap-4 mt-8"
              >
                <span className="text-sm text-gray-600">Trusted by teams at</span>
                <div className="flex gap-6">
                  <Image src="/images/logo.png" alt="Uber" width={60} height={24} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                  <Image src="/images/logo.png" alt="Airbnb" width={76} height={24} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                  <Image src="/images/logo.png" alt="Slack" width={72} height={24} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </div>
                  </motion.div>
            </div>
            
            {/* Right side animation */}
            <div className="w-full lg:w-1/2 relative">
                  <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative w-full mx-auto overflow-hidden"
              >
                <div className="aspect-[3/2] rounded-2xl bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/80">
                    {/* Design UI mockup */}
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 w-3/4">
                      <div className="space-y-3">
                        <div className="h-4 w-1/3 bg-primary/20 rounded-full animate-pulse"></div>
                        <div className="h-6 w-4/5 bg-gray-800/80 rounded-md"></div>
                        <div className="h-4 w-2/3 bg-gray-300 rounded-full"></div>
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <motion.div 
                          className="p-3 rounded-lg border border-green-200 bg-green-50 flex items-start gap-3"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1, duration: 0.5 }}
                        >
                          <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">Log in to your account</p>
                            <p className="text-xs text-gray-500 mt-1">Rating: 98% matches brand voice</p>
                          </div>
                  </motion.div>
                        
                        <motion.div 
                          className="p-3 rounded-lg border border-blue-200 bg-blue-50 flex items-start gap-3"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.2, duration: 0.5 }}
                        >
                          <Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">Welcome back, sign in to continue</p>
                            <p className="text-xs text-gray-500 mt-1">Rating: 92% matches brand voice</p>
                </div>
                        </motion.div>
                        
                        <motion.div 
                          className="p-3 rounded-lg border border-purple-200 bg-purple-50 flex items-start gap-3"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.4, duration: 0.5 }}
                        >
                          <Check size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">Sign in to access your dashboard</p>
                            <p className="text-xs text-gray-500 mt-1">Rating: 88% matches brand voice</p>
              </div>
                        </motion.div>
            </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-40 blur-2xl"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <motion.div 
          className="flex justify-center mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
              <motion.button 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            onClick={() => {
              const nextSection = document.getElementById('how-it-works');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Scroll to How It Works"
          >
            <ChevronDown size={24} />
              </motion.button>
        </motion.div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How CopySnap Works
            </h2>
            <p className="text-lg text-gray-600">
              Generate on-brand UX copy in seconds with our AI-powered platform
            </p>
              </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M8 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"></path>
                    <path d="M15.5 12a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0z"></path>
                    <path d="M12 8.5a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z"></path>
                    <path d="M15.5 20a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0z"></path>
                    <path d="M8 8.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"></path>
                  </svg>
                </motion.div>
          </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect Your Design
              </h3>
              
              <p className="text-gray-600 mb-4">
                Upload your design via Figma plugin or direct integration. CopySnap analyzes your UI components.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-4 h-32 rounded-lg bg-gray-50 flex items-center justify-center"
              >
                <Image
                  src="/images/figma-connect.png"
                  alt="Connect Figma Design"
                  width={120}
                  height={96}
                  className="object-contain"
                />
              </motion.div>
              
              <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xl font-bold text-primary">01</span>
                <motion.div
                  className="text-gray-400"
                  whileHover={{ x: 5, color: "#4F46E5" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M12 3v4"></path>
                    <path d="M12 17v4"></path>
                    <path d="M5.636 5.636l2.828 2.828"></path>
                    <path d="M15.536 15.536l2.828 2.828"></path>
                    <path d="M3 12h4"></path>
                    <path d="M17 12h4"></path>
                    <path d="M5.636 18.364l2.828-2.828"></path>
                    <path d="M15.536 8.464l2.828-2.828"></path>
                  </svg>
                </motion.div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Define Brand Voice
              </h3>
              
              <p className="text-gray-600 mb-4">
                Set up your brand voice with tone, style, and user persona parameters to match your brand perfectly.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-4 h-32 rounded-lg bg-gray-50 flex items-center justify-center"
              >
                <Image
                  src="/images/logo.png"
                  alt="Brand Voice Configuration"
                  width={120}
                  height={96}
                  className="object-contain"
                />
              </motion.div>
              
              <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xl font-bold text-accent">02</span>
                <motion.div
                  className="text-gray-400"
                  whileHover={{ x: 5, color: "#EC4899" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-5">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles size={24} className="text-success" />
                </motion.div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Generate & Implement
              </h3>
              
              <p className="text-gray-600 mb-4">
                Get instant, context-aware UX copy suggestions. Preview, edit, and implement with one click.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-4 h-32 rounded-lg bg-gray-50 flex items-center justify-center"
              >
                <Image
                  src="/images/generate-copy.png"
                  alt="Generate Copy"
                  width={120}
                  height={96}
                  className="object-contain"
                />
              </motion.div>
              
              <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xl font-bold text-success">03</span>
                <motion.div
                  className="text-gray-400"
                  whileHover={{ x: 5, color: "#10B981" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-14 text-center"
          >
            <motion.a
              href="https://www.figma.com/community/plugin/copysnap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary-dark transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn more about how it works
              <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </div>
      </section>
      
      {/* Live Demo Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See CopySnap in Action
            </h2>
            <p className="text-lg text-gray-600">
              Experience how AI-generated copy transforms your UI elements in real-time
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white"
          >
            {/* Demo Header */}
            <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm font-medium text-gray-600">CopySnap Demo Interface</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Brand Tone:</span>
                  <select className="text-sm bg-white border border-gray-300 rounded-md px-2 py-1">
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Playful</option>
              </select>
            </div>
            
                <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-md flex items-center gap-1">
                  <Play size={12} />
                  Refresh
                </button>
              </div>
            </div>
            
            {/* Demo Content */}
            <div className="p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Left: UI Components */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">UI Components</h3>
                  
                  {/* Component 1: Button */}
                  <motion.div
                    className="relative p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:border-primary/30 transition-colors duration-300"
                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <div className="mb-3 pb-2 border-b border-gray-200">
                      <span className="text-xs font-medium text-gray-500">COMPONENT TYPE</span>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Primary Button</span>
                        <span className="text-xs text-gray-500">Login Screen</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center py-4">
                      <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium">
                        Continue with account
            </button>
                    </div>
                    
                    <div className="mt-2 text-center">
                      <motion.button
                        className="text-xs text-primary flex items-center gap-1 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Sparkles size={12} />
                        Generate alternatives
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {/* Component 2: Error state */}
                  <motion.div
                    className="relative p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:border-primary/30 transition-colors duration-300"
                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <div className="mb-3 pb-2 border-b border-gray-200">
                      <span className="text-xs font-medium text-gray-500">COMPONENT TYPE</span>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Error Message</span>
                        <span className="text-xs text-gray-500">Form Validation</span>
                    </div>
                  </div>
                    
                    <div className="flex justify-center py-4">
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 max-w-md">
                        <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">Unable to process your request</p>
                          <p className="text-red-600 opacity-80 mt-1">Please check your information and try again.</p>
                </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-center">
                      <motion.button
                        className="text-xs text-primary flex items-center gap-1 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Sparkles size={12} />
                        Generate alternatives
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {/* Component 3: Empty State */}
                  <motion.div
                    className="relative p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:border-primary/30 transition-colors duration-300"
                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <div className="mb-3 pb-2 border-b border-gray-200">
                      <span className="text-xs font-medium text-gray-500">COMPONENT TYPE</span>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Empty State</span>
                        <span className="text-xs text-gray-500">Dashboard</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center py-4">
                      <div className="text-center p-4 max-w-md">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h4 className="text-gray-800 font-medium">No projects found</h4>
                        <p className="text-gray-500 text-sm mt-1">Create your first project to get started</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-center">
                      <motion.button
                        className="text-xs text-primary flex items-center gap-1 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Sparkles size={12} />
                        Generate alternatives
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
                
                {/* Right: AI Generated Copy */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Generated Copy</h3>
                  
                  {/* Generated alternatives for Button */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-5 border border-green-200 bg-green-50/50 rounded-lg mb-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold text-gray-700">Button Text Alternatives</span>
                      <div className="text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded-full">
                        98% Match
                      </div>
                    </div>
                    
                <div className="space-y-3">
                    <motion.div 
                        className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all cursor-pointer flex justify-between items-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="font-medium">Sign in to continue</span>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.div>
                      
                      <motion.div 
                        className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all cursor-pointer flex justify-between items-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="font-medium">Access your account</span>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                      
                      <motion.div 
                        className="p-3 bg-white rounded-lg border border-primary/30 shadow-sm flex justify-between items-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="font-medium text-primary">Continue with account</span>
                        <Check size={16} className="text-primary" />
                      </motion.div>
                </div>
                  </motion.div>
                  
                  {/* Features promoter */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Enhance Your UX Copy
                    </h4>
                    
                    <ul className="space-y-3 mb-5">
                      <li className="flex items-start gap-2">
                        <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">AI-generated alternatives for every component</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Customized to match your brand voice perfectly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">One-click implementation back to your design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Accessible copy suggestions that follow best practices</span>
                      </li>
                    </ul>
                    
                    <motion.a
                      href="https://www.figma.com/community/plugin/copysnap"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primary-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Use on Your Design</span>
                      <ArrowRight size={16} />
                    </motion.a>
                  </motion.div>
            </div>
          </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Who It's For */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Parallax background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0.1 }}
            whileInView={{ opacity: 0.05 }}
            className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/10"
            style={{ 
              transform: "translateY(calc(var(--scrollY) * 0.05))" 
            }}
          />
          <motion.div 
            initial={{ opacity: 0.1 }}
            whileInView={{ opacity: 0.05 }}
            className="absolute -left-32 top-40 w-64 h-64 rounded-full bg-accent/10"
            style={{ 
              transform: "translateY(calc(var(--scrollY) * -0.03))" 
            }}
          />
          <motion.div 
            initial={{ opacity: 0.1 }}
            whileInView={{ opacity: 0.05 }}
            className="absolute right-20 bottom-20 w-80 h-80 rounded-full bg-success/10"
            style={{ 
              transform: "translateY(calc(var(--scrollY) * 0.07))" 
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who It's For
            </h2>
            <p className="text-lg text-gray-600">
              CopySnap helps different roles streamline their UX writing workflow
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                role: "UX Designer",
                description: "Focus on design, not writing. Generate copy that fits your layouts perfectly.",
                testimonial: "CopySnap cut our UX writing time in half. The context-aware suggestions are spot on for our brand tone.",
                name: "Alex Chen",
                title: "Senior UX Designer at Designly"
              },
              {
                role: "Product Designer",
                description: "Create consistent messaging across your product without endless revisions.",
                testimonial: "We shaved weeks off our launch by using CopySnap to handle all the small UI copy elements across our app.",
                name: "Sarah Wang",
                title: "Product Lead at Workflow"
              },
              {
                role: "Content Strategist",
                description: "Focus on major content while CopySnap handles UI text elements.",
                testimonial: "CopySnap isn't replacing me—it's making me more efficient by handling routine UI elements.",
                name: "Michael Lee",
                title: "Senior Content Strategist"
              }
            ].map((persona, index) => (
              <motion.div
                    key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:border-primary/30 transition-all duration-300 group relative overflow-hidden h-full"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <FiUser className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{persona.role}</h3>
                  <p className="text-gray-600">{persona.description}</p>
                </div>
                
                {/* Testimonial that appears on hover */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90 text-white p-6 flex flex-col justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <p className="text-lg mb-4 italic">"{persona.testimonial}"</p>
                  <div className="mt-auto">
                    <p className="font-semibold">{persona.name}</p>
                    <p className="text-sm text-white/80">{persona.title}</p>
                  </div>
                </motion.div>
                
                <div className="text-center mt-auto pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-primary font-medium text-sm flex items-center mx-auto"
                  >
                    <span className="mr-1">Learn more</span>
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Brand Voice Tuner Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tune Your Brand Voice
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Adjust tone parameters to match your brand's unique personality
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Sliders */}
              <div className="p-8 bg-white border-r border-gray-100">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Zap size={20} className="text-primary mr-2" />
                  Voice Parameters
                </h3>
                
                <div className="space-y-8">
                  {/* Tone Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label htmlFor="tone" className="text-sm font-medium text-gray-700 flex items-center">
                        Brand Tone
                        <div className="relative group ml-2">
                          <Info size={14} className="text-gray-400 cursor-help" />
                          <div className="absolute left-0 -top-2 transform -translate-y-full w-64 p-2 bg-black rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            Affects how casual or formal your copy will sound
                  </div>
                  </div>
                      </label>
                      <span className="text-xs font-medium text-primary">70%</span>
                </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Friendly</span>
                        <span>Formal</span>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                      >
                        <input
                          type="range"
                          id="tone"
                          min="0"
                          max="100"
                          defaultValue="70"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="absolute inset-0 w-[70%] h-2 bg-gradient-to-r from-blue-400 to-primary rounded-l-lg pointer-events-none"></div>
              </motion.div>
          </div>
        </div>
                  
                  {/* Style Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label htmlFor="style" className="text-sm font-medium text-gray-700 flex items-center">
                        Writing Style
                        <div className="relative group ml-2">
                          <Info size={14} className="text-gray-400 cursor-help" />
                          <div className="absolute left-0 -top-2 transform -translate-y-full w-64 p-2 bg-black rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            Controls how concise or detailed your copy will be
                          </div>
                        </div>
                      </label>
                      <span className="text-xs font-medium text-primary">40%</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Brief</span>
                        <span>Descriptive</span>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                      >
                        <input
                          type="range"
                          id="style"
                          min="0"
                          max="100"
                          defaultValue="40"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="absolute inset-0 w-[40%] h-2 bg-gradient-to-r from-blue-400 to-primary rounded-l-lg pointer-events-none"></div>
                      </motion.div>
            </div>
                  </div>
                  
                  {/* Voice Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label htmlFor="voice" className="text-sm font-medium text-gray-700 flex items-center">
                        Personality
                        <div className="relative group ml-2">
                          <Info size={14} className="text-gray-400 cursor-help" />
                          <div className="absolute left-0 -top-2 transform -translate-y-full w-64 p-2 bg-black rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            Adjusts how human or professional your brand voice sounds
                          </div>
                        </div>
                      </label>
                      <span className="text-xs font-medium text-primary">60%</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Human</span>
                        <span>Professional</span>
          </div>
          
          <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                      >
                        <input
                          type="range"
                          id="voice"
                          min="0"
                          max="100"
                          defaultValue="60"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="absolute inset-0 w-[60%] h-2 bg-gradient-to-r from-blue-400 to-primary rounded-l-lg pointer-events-none"></div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="grid grid-cols-4 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-xs py-2 px-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                      >
                        Friendly
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-xs py-2 px-3 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                      >
                        Professional
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-xs py-2 px-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                      >
                        Playful
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-xs py-2 px-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                      >
                        Minimal
                      </motion.button>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center"
                    >
                      <Sparkles size={18} className="mr-2" />
                      Apply Voice & Generate
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Right: Preview */}
              <div className="p-8 bg-gray-50">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Eye size={20} className="text-primary mr-2" />
                  Live Copy Preview
                </h3>
                
                <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {/* Preview of Button text */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Button</div>
                    <div className="flex justify-between items-center">
                      <div className="bg-primary text-white text-sm font-medium py-2 px-4 rounded">
                        Continue to Dashboard
                </div>
                      <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>
                  
                  {/* Preview of Success Message */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Success Message</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Your changes have been successfully saved.</span>
                </div>
                      <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>
                  
                  {/* Preview of Error Message */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Error Message</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle size={16} className="text-red-500" />
                        <span>We encountered an issue. Please try again.</span>
                      </div>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  </div>
                  
                  {/* Preview of Empty State */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Empty State</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FolderOpen size={16} className="text-gray-400" />
                        <span>No items found. Add your first item to get started.</span>
                      </div>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                        <p className="font-medium mb-1">Professional, Concise, Tech-Focused</p>
                        <p>Your current voice settings suggest a professional tone with direct messaging and a focus on clarity.</p>
                </div>
                </div>
              </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Integrations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Works Where Your Design Lives
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seamlessly integrate with your favorite design and productivity tools
            </p>
          </motion.div>
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute -right-4 md:right-8 -top-10 rotate-12"
            >
              <div className="relative group">
                <Info size={20} className="text-primary cursor-help" />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute right-0 top-0 transform translate-x-2 -translate-y-full w-64 p-3 bg-white rounded-xl text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-gray-100 z-10"
                >
                  CopySnap works where your design lives.
                  <div className="absolute right-5 bottom-0 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-100"></div>
                </motion.div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { name: "Figma", delay: 0 },
                { name: "Notion", delay: 0.1 },
                { name: "Sketch", delay: 0.2 },
                { name: "Linear", delay: 0.3 }
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: tool.delay, duration: 0.5 }}
                  className="flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ filter: "grayscale(100%)" }}
                    whileInView={{ filter: "grayscale(0%)" }}
                    transition={{ delay: tool.delay + 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-4 h-24 w-24 flex items-center justify-center bg-white shadow-md rounded-2xl border border-gray-100 p-4"
                  >
                    <Image 
                      src="/images/logo.png"
                      alt={`${tool.name} Logo`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600 text-center mt-1">
                    {
                      tool.name === "Figma" ? "Direct plugin integration" :
                      tool.name === "Notion" ? "API connector" :
                      tool.name === "Sketch" ? "Export/import support" :
                      "Issue linking"
                    }
                  </p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-16 text-center"
            >
              <span className="inline-block px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">
                More integrations coming soon
              </span>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer - enhance with better hover effects */}
      <footer className="bg-white py-12 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <Link href="/" className="inline-block">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Image 
                  src="/images/logo.png" 
                  alt="CopySnap Logo" 
                  width={152} 
                  height={40} 
                  priority
                      className="transition-opacity hover:opacity-90"
                />
                  </motion.div>
                </Link>
              </div>
              <p className="text-gray-600">
                Context-aware UX copy generation for digital products.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition-colors inline-flex items-center">
                    <span className="border-b border-transparent group-hover:border-primary">About Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors inline-flex items-center">
                    <span className="border-b border-transparent group-hover:border-primary">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-primary transition-colors inline-flex items-center">
                    <span className="border-b border-transparent group-hover:border-primary">Terms of Service</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="mb-3">
                <a href="mailto:hello@copysnap.ai" className="text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-1 group">
                  <span className="border-b border-transparent group-hover:border-primary">hello@copysnap.ai</span>
                </a>
              </p>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://github.com/copysnap" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="border-b border-transparent group-hover:border-primary">GitHub</span>
                  <FiExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href="https://twitter.com/copysnap" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="border-b border-transparent group-hover:border-primary">Twitter</span>
                  <FiExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} CopySnap. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Enhanced Sticky CTA Banner - Full-width Call to Action */}
        <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-accent shadow-lg border-t p-4 z-30"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex-grow md:mr-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="input w-full bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 text-black placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-3 mt-3 md:mt-0 w-full md:w-auto">
            <motion.button 
              className="btn-primary whitespace-nowrap flex items-center justify-center gap-1 bg-white text-primary hover:bg-white/90 flex-1 md:flex-auto"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              Start Generating Smarter UX Copy
              <ArrowRight className="ml-1" />
            </motion.button>
            <motion.a
              href="https://www.figma.com/community/plugin/copysnap"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 flex-1 md:flex-auto flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="mr-2">
                <path d="M8 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"></path>
                <path d="M15.5 12a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0z"></path>
                <path d="M12 8.5a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z"></path>
                <path d="M15.5 20a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0z"></path>
                <path d="M8 8.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"></path>
              </svg>
              Install Figma Plugin
            </motion.a>
          </div>
          </div>
        </motion.div>
    </div>
  )
} 