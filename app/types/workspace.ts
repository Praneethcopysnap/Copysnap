export interface Workspace {
  id: string;
  name: string;
  description: string;
  lastEdited: string;
  members: number;
  dateCreated?: string;
  copyCount?: number;
  
  // Additional fields for extended functionality
  figmaLink?: string;
  brandVoiceFile?: string;
  tone?: string;
  style?: string;
  voice?: string;
  personaDescription?: string;
} 