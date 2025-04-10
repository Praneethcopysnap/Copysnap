'use client';

import React, { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SiteHeader from './components/SiteHeader'
import Waitlist_Form from './components/Waitlist_Form'
import { FiArrowRight, FiCheck, FiX, FiUser, FiLayers, FiCpu, FiEdit, FiCopy, FiExternalLink } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    company: 'DesignHub',
    quote: 'CopySnap cut our UX writing time in half. The context-aware suggestions are spot on for our brand tone.'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'TechFlow',
    quote: 'Our designers and writers are finally speaking the same language thanks to CopySnap. Huge productivity win.'
  },
  {
    id: 3,
    name: 'Alex Johnson',
    role: 'UX Writer',
    company: 'ContentFirst',
    quote: 'As a UX writer, CopySnap doesn\'t replace me - it makes me better by handling the routine copy so I can focus on strategy.'
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
  const [selectedFrame, setSelectedFrame] = useState(mockFrames[0].id);
  const [generatedCopy, setGeneratedCopy] = useState(mockGeneratedCopy[mockFrames[0].id]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('designers');
  const [showStickyBanner, setShowStickyBanner] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as ToastType
  });
  
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
  
  return (
    <>
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
      
      {/* Hero Section with Product Animation */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <motion.div 
          className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text bg-gradient-to-r from-primary to-blue-700 text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Context-Aware UX Copy for Digital Products
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-8 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Generate copy that understands your product, instantly.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a 
                href="#demo" 
                className="btn-primary flex items-center gap-2"
                onClick={(e) => handleAnchorClick(e, '#demo')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Try it in Figma
                <FiArrowRight className="ml-1" />
              </motion.a>
              <motion.a 
                href="#waitlist" 
                className="btn-secondary"
                onClick={(e) => handleAnchorClick(e, '#waitlist')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Join the Waitlist
              </motion.a>
            </motion.div>
          </div>
          <motion.div
            className="relative bg-white p-8 rounded-lg shadow-xl border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-gray-100 p-4 rounded mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-xs text-gray-500 ml-2">Figma.app</span>
              </div>
              <div className="aspect-video bg-white rounded-md relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="bg-primary text-white px-4 py-2 rounded-md inline-block"
                  >
                    Complete your purchase
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs p-2 rounded"
                  >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
                    Generated by CopySnap
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <motion.span 
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.3 }}
                >
                  10+ alternatives
                </motion.span>
                <motion.span 
                  className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.3 }}
                >
                  On-brand
                </motion.span>
              </div>
              <motion.button 
                className="text-primary text-sm font-medium cursor-pointer hover:underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.3 }}
                onClick={handleRegenerate}
              >
                Regenerate
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiLayers size={40} className="text-primary" />,
                title: "Select a frame in Figma",
                description: "Choose the UI element you need copy for - buttons, forms, error states, and more."
              },
              {
                icon: <FiCpu size={40} className="text-primary" />,
                title: "CopySnap analyzes context",
                description: "Our AI reads your design, understands placement, and considers user flow."
              },
              {
                icon: <FiEdit size={40} className="text-primary" />,
                title: "Generate contextual copy",
                description: "Get multiple copy options that match your brand voice and design context."
              },
              {
                icon: <FiCheck size={40} className="text-primary" />,
                title: "Review and implement",
                description: "Choose the best option, save it to your library, and apply directly to designs."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Use the new Demo Section component */}
      <DemoSection />
      
      {/* Why CopySnap is Different */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Why CopySnap is Different</h2>
          <p className="text-center text-lg mb-12 max-w-2xl mx-auto">
            Not all AI writing tools are created equal. See how CopySnap stands apart.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-center">CopySnap</th>
                  <th className="px-6 py-4 text-center">ChatGPT</th>
                  <th className="px-6 py-4 text-center">Jasper</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { feature: "Reads Figma context", copysnap: true, chatgpt: false, jasper: false },
                  { feature: "Learns brand voice", copysnap: true, chatgpt: false, jasper: true },
                  { feature: "UX-focused suggestions", copysnap: true, chatgpt: false, jasper: false },
                  { feature: "One-click tooltip/CTA gen", copysnap: true, chatgpt: false, jasper: false },
                  { feature: "UX copy library", copysnap: true, chatgpt: false, jasper: true }
                ].map((row, index) => (
                  <motion.tr 
                    key={index} 
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">{row.copysnap ? <FiCheck className="mx-auto text-green-500" /> : <FiX className="mx-auto text-gray-300" />}</td>
                    <td className="px-6 py-4 text-center">{row.chatgpt ? <FiCheck className="mx-auto text-green-500" /> : <FiX className="mx-auto text-gray-300" />}</td>
                    <td className="px-6 py-4 text-center">{row.jasper ? <FiCheck className="mx-auto text-green-500" /> : <FiX className="mx-auto text-gray-300" />}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* Social Proof / Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <FiUser className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <p className="italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Audience Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Who It's For</h2>
          <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
            See how CopySnap benefits different roles in your team.
          </p>
          
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-md shadow-sm">
              {['designers', 'pms', 'writers'].map((tab) => (
                <button
                  key={tab}
                  className={`px-5 py-2.5 text-sm font-medium ${
                    activeTab === tab 
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${tab === 'designers' ? 'rounded-l-lg' : ''} ${tab === 'writers' ? 'rounded-r-lg' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  For {tab === 'pms' ? 'Product Managers' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            {activeTab === 'designers' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">For Designers</h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Focus on design, not writing. Generate copy that fits your layouts perfectly.</span>
                    </li>
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Generate on-brand copy directly in Figma without switching tools.</span>
                    </li>
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Get multiple options for buttons, tooltips, error messages and more.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="italic mb-4">"CopySnap is a game-changer. I can iterate on layouts faster without waiting for copy from marketing."</p>
                  <p className="font-medium">— Alex, Senior UI Designer</p>
                </div>
              </div>
            )}
            
            {activeTab === 'pms' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">For Product Managers</h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Ensure consistent messaging across your product without endless revisions.</span>
                    </li>
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Speed up development by removing copy bottlenecks.</span>
                    </li>
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Create a centralized copy library your entire team can reference.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <p className="italic mb-4">"We shaved weeks off our launch by using CopySnap to handle all the small UI copy elements across our app."</p>
                  <p className="font-medium">— Sarah, Product Lead</p>
                </div>
              </div>
            )}
            
            {activeTab === 'writers' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">For Content Writers</h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Focus on major content while CopySnap handles UI text elements.</span>
                    </li>
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Create on-brand copy faster with AI that understands your product's context.</span>
                    </li>
                    <li className="flex">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Maintain consistent voice and terminology across your entire product.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <p className="italic mb-4">"CopySnap isn't replacing me—it's making me more efficient. I can focus on strategic content while it handles the routine UI elements."</p>
                  <p className="font-medium">— Michael, UX Writer</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Waitlist Form */}
      <section id="waitlist" ref={waitlistRef} className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Waitlist</h2>
          <p className="mb-8">
            Be the first to know when CopySnap launches. Early access for waitlist members.
          </p>
          <Waitlist_Form />
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
      
      {/* Enhanced Sticky CTA Banner */}
      {showStickyBanner && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-30"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <p className="font-medium mb-4 md:mb-0">
              Want copy that sounds like your product? Join the waitlist.
            </p>
            <motion.a 
              href="#waitlist" 
              className="btn-primary whitespace-nowrap flex items-center gap-1"
              onClick={(e) => handleAnchorClick(e, '#waitlist')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Waitlist <FiArrowRight className="ml-1" />
            </motion.a>
          </div>
        </motion.div>
      )}
    </>
  )
} 