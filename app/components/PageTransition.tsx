'use client';

import { motion } from 'framer-motion';

// Define the props without relying on ReactNode type
interface PageTransitionProps {
  children: any;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="w-full min-h-screen">
      {/* We expect children to be a flex container with AuthSidePanel and content */}
      {children && children.props && children.props.children ? (
        <div className="flex min-h-screen">
          {/* First child - AuthSidePanel - render without animation */}
          {children.props.children[0]}
          
          {/* Second child - Content - add animation */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ 
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full md:w-1/2 flex items-center justify-center p-8"
          >
            {/* Get the children of the content container */}
            {children.props.children[1] && children.props.children[1].props ? 
              children.props.children[1].props.children : 
              children.props.children[1]}
          </motion.div>
        </div>
      ) : (
        // Fallback: If structure doesn't match, just return children
        children
      )}
    </div>
  );
} 