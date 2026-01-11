
export type Role = 'ADMIN' | 'USER';

export type MediaType = 'image' | 'video' | 'document' | 'presentation';

export interface MediaAttachment {
  id: string;
  type: MediaType;
  url: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added password field
  role: Role;
  department: string;
  joinDate: string;
  progress: number;
}

export interface InductionSection {
  id: string;
  title: string;
  content: string;
  category: 'Company' | 'HR' | 'Safety' | 'Operations';
  lastUpdated: string;
  order: number;
  attachments: MediaAttachment[]; // Added multimedia support
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
