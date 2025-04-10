// Add className support to react-icons
import { IconBaseProps as OriginalIconBaseProps } from 'react-icons';

declare module 'react-icons' {
  export interface IconBaseProps extends OriginalIconBaseProps {
    className?: string;
  }
} 