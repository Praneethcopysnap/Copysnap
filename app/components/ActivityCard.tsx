import React from 'react';
import { Activity } from '../services/activity';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  File, 
  Pencil, 
  Plus, 
  Copy, 
  Trash,
  Users,
  Link
} from 'lucide-react'; 
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface ActivityCardProps {
  activity: Activity & {
    title?: string;
    status?: 'completed' | 'pending' | 'failed';
  };
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'create':
        return <Plus className="text-green-500" />;
      case 'edit':
        return <Pencil className="text-blue-500" />;
      case 'generate':
        return <Copy className="text-indigo-500" />;
      case 'share':
        return <Users className="text-purple-500" />;
      case 'member':
        return <Link className="text-amber-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };
  
  const getStatusIcon = () => {
    if (!activity.status) return null;
    
    switch (activity.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Get background class based on activity type
  const getBackgroundClass = () => {
    switch (activity.type) {
      case 'create':
        return 'pill-badge-glow success';
      case 'edit':
        return 'pill-badge-glow primary';
      case 'generate':
        return 'pill-badge-glow accent';
      case 'share':
        return 'pill-badge-glow primary';
      case 'member':
        return 'pill-badge-glow warning';
      default:
        return 'pill-badge-glow';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, h:mm a');
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card-gradient mt-3 overflow-hidden"
    >
      <div className="p-4 flex items-start space-x-4">
        <div className="avatar-neon h-10 w-10 flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.title || activity.description}
            </p>
            <span className={getBackgroundClass()}>
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            </span>
          </div>
          
          <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              {formatDate(activity.created_at)}
            </div>
            
            {activity.status && (
              <div className="flex items-center text-xs">
                {getStatusIcon()}
                <span className="ml-1 capitalize">
                  {activity.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add gradient ornament in bottom right */}
      <div className="gradient-ornament w-20 h-20 -bottom-10 -right-10 opacity-5"></div>
    </motion.div>
  );
};

export default ActivityCard; 