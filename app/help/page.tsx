'use client';

import { useState } from 'react'
import * as React from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import SiteHeader from "../components/SiteHeader"
import DashboardSidebar from '../components/Dashboard_Sidebar'

// FAQ data
const faqs = [
  {
    question: "How do I connect CopySnap to Figma?",
    answer: "Install our Figma plugin from the Figma plugin store, then log in with your CopySnap account credentials. Navigate to the Integrations section in your settings to complete the connection process."
  },
  {
    question: "Can I customize the tone and voice of generated copy?",
    answer: "Yes, you can define your brand voice parameters in the Brand Voice section. This allows you to specify tone, style, and terminology preferences that will be applied to all generated copy."
  },
  {
    question: "How does the AI understand my product context?",
    answer: "CopySnap analyzes design elements, user flows, and your brand guidelines to generate contextually relevant copy. The more information you provide about your product and brand, the better the results will be."
  },
  {
    question: "Is there a limit to how many copy suggestions I can generate?",
    answer: "Different subscription plans have different generation limits. Check your current plan in the Settings > Billing section to see your monthly allocation and usage."
  },
  {
    question: "How do I share copy with my team?",
    answer: "You can invite team members to your workspace from the Team Members section in Settings. All copy generated in shared workspaces is accessible to team members with appropriate permissions."
  }
];

// Resource links
const DOCUMENTATION_URL = '/help/documentation';
const VIDEO_TUTORIALS_URL = '/help/tutorials';
const KNOWLEDGE_BASE_URL = '/help/knowledge-base';

export default function HelpPage() {
  const router = useRouter();
  const [activeContact, setActiveContact] = useState('email');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  
  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
    
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: { [key: string]: string }) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      setFormData({ subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }, 1500);
  };
  
  const handleStartChat = () => {
    setChatActive(true);
  };
  
  const navigateToDocumentation = () => {
    router.push(DOCUMENTATION_URL);
  };
  
  const navigateToTutorials = () => {
    router.push(VIDEO_TUTORIALS_URL);
  };
  
  const navigateToKnowledgeBase = () => {
    router.push(KNOWLEDGE_BASE_URL);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <DashboardSidebar />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
            <p className="text-lg mb-8">
              Find answers to common questions or contact our support team for assistance.
            </p>
            
            {/* Search */}
            <div className="mb-10">
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  className="input pl-10 py-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg 
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Help sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="card hover:shadow-md transition-shadow">
                <svg className="w-8 h-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                <p className="text-gray-600 mb-4">Comprehensive guides on using all features of CopySnap.</p>
                <button 
                  onClick={navigateToDocumentation} 
                  className="text-primary font-medium hover:underline focus:outline-none"
                >
                  Browse documentation →
                </button>
              </div>
              
              <div className="card hover:shadow-md transition-shadow">
                <svg className="w-8 h-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">Step-by-step video guides for common tasks and workflows.</p>
                <button 
                  onClick={navigateToTutorials} 
                  className="text-primary font-medium hover:underline focus:outline-none"
                >
                  Watch tutorials →
                </button>
              </div>
              
              <div className="card hover:shadow-md transition-shadow">
                <svg className="w-8 h-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
                <p className="text-gray-600 mb-4">Articles and answers to common questions and troubleshooting.</p>
                <button 
                  onClick={navigateToKnowledgeBase} 
                  className="text-primary font-medium hover:underline focus:outline-none"
                >
                  Explore knowledge base →
                </button>
              </div>
            </div>
            
            {/* FAQs */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4 max-w-4xl">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <div key={index} className="card">
                      <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    <button 
                      className="mt-2 text-primary font-medium"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Support */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Contact Support</h2>
              
              <div className="card max-w-4xl">
                <div className="flex border-b mb-6">
                  <button
                    className={`py-3 px-6 font-medium ${activeContact === 'email' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveContact('email')}
                  >
                    Email Support
                  </button>
                  <button
                    className={`py-3 px-6 font-medium ${activeContact === 'chat' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveContact('chat')}
                  >
                    Live Chat
                  </button>
                </div>
                
                {activeContact === 'email' ? (
                  <div>
                    {showSuccessMessage ? (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Message sent successfully! We'll get back to you within 24 hours.</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mb-4">Our support team is available Monday-Friday, 9am-6pm EST. We typically respond within 24 hours.</p>
                        <form className="space-y-4" onSubmit={handleSubmitForm}>
                          <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input 
                              type="text" 
                              id="subject" 
                              name="subject"
                              className="input" 
                              placeholder="What can we help you with?" 
                              value={formData.subject}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea 
                              id="message" 
                              name="message"
                              rows={4} 
                              className="input" 
                              placeholder="Please describe your issue in detail..."
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                          <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    {chatActive ? (
                      <div className="text-left">
                        <div className="bg-gray-100 p-4 rounded mb-4">
                          <p className="text-sm text-gray-500 mb-2">Support Agent</p>
                          <p>Hello! Thanks for contacting CopySnap support. How can I help you today?</p>
                        </div>
                        <div className="flex mb-4">
                          <input 
                            type="text" 
                            className="input flex-grow mr-2" 
                            placeholder="Type your message..."
                          />
                          <button className="btn-primary">Send</button>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          Your conversation will be saved for quality assurance.
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg className="w-16 h-16 mx-auto text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-lg mb-4">Our live chat support is available Monday-Friday, 9am-6pm EST.</p>
                        <button 
                          className="btn-primary"
                          onClick={handleStartChat}
                        >
                          Start Chat Session
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 