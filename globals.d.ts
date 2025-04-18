// Declaring modules to resolve TypeScript errors
declare module '*.tsx' {
  const Component: any;
  export default Component;
}

// Add className support to react-icons
import { IconBaseProps as OriginalIconBaseProps } from 'react-icons';

declare module 'react-icons' {
  export interface IconBaseProps extends OriginalIconBaseProps {
    className?: string;
  }
}

// Fix for React hooks generics
import React from 'react';

declare module 'react' {
  function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  function useState<T = undefined>(): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];
  
  function useRef<T>(initialValue: T): React.RefObject<T>;
  function useRef<T = undefined>(): React.RefObject<T | undefined>;
}

// Individual component declarations
// Header declaration removed to avoid conflicts

declare module 'app/components/Waitlist_Form' {
  const Waitlist_Form: any;
  export default Waitlist_Form;
}

declare module 'app/components/Login_Form' {
  const Login_Form: any;
  export default Login_Form;
}

declare module 'app/components/Dashboard_Sidebar' {
  const Dashboard_Sidebar: any;
  export default Dashboard_Sidebar;
}

declare module 'app/components/Workspace_List' {
  const Workspace_List: any;
  export default Workspace_List;
}

declare module 'app/components/Figma_PluginDemo' {
  const Figma_PluginDemo: any;
  export default Figma_PluginDemo;
}

declare module 'app/components/Brand_VoiceForm' {
  const Brand_VoiceForm: any;
  export default Brand_VoiceForm;
}

declare module 'app/components/Content_Library' {
  const Content_Library: any;
  export default Content_Library;
}

declare module 'app/components/Workspace_Grid' {
  const Workspace_Grid: any;
  export default Workspace_Grid;
}

declare module 'app/components/Signup_Form' {
  const Signup_Form: any;
  export default Signup_Form;
}

// Removed to fix naming conflict with actual component file
// declare module 'app/components/Admin_Stats' {
//   const AdminStatsComponent: any;
//   export default AdminStatsComponent;
// }

declare module 'app/components/Admin_UserTable' {
  const Admin_UserTable: any;
  export default Admin_UserTable;
}