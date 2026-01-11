
import { User, InductionSection } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'System Admin',
    email: 'admin@bestpacific.com',
    password: 'admin', // Added default password
    role: 'ADMIN',
    department: 'Executive',
    joinDate: '2020-01-01',
    progress: 100
  },
  {
    id: '2',
    name: 'New Employee',
    email: 'user@bestpacific.com',
    password: 'user123', // Added default password
    role: 'USER',
    department: 'Production',
    joinDate: '2024-05-10',
    progress: 15
  }
];

export const INITIAL_SECTIONS: InductionSection[] = [
  {
    id: 's1',
    title: 'Welcome to Best Pacific',
    content: 'Best Pacific Textiles Lanka is a leader in high-end apparel materials. We are committed to innovation and excellence in the textile industry.',
    category: 'Company',
    lastUpdated: new Date().toISOString(),
    order: 1,
    attachments: [
      { id: 'm1', type: 'video', name: 'Corporate Intro', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' }
    ]
  },
  {
    id: 's2',
    title: 'Our Vision & Values',
    content: 'Our vision is to be the global benchmark in textile manufacturing. Our values: Integrity, Innovation, Customer Focus, and Sustainability.',
    category: 'Company',
    lastUpdated: new Date().toISOString(),
    order: 2,
    attachments: [
      { id: 'm2', type: 'presentation', name: 'Vision 2025 PPT', url: '#' }
    ]
  },
  {
    id: 's3',
    title: 'Health and Safety Protocols',
    content: 'Safety is our top priority. All employees must wear PPE in designated zones.',
    category: 'Safety',
    lastUpdated: new Date().toISOString(),
    order: 3,
    attachments: [
      { id: 'm3', type: 'document', name: 'Safety Manual PDF', url: '#' }
    ]
  }
];
