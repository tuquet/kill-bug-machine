import { LucideIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CompassIcon, DatabaseIcon, AlertTriangleIcon } from 'lucide-react';

export type AppCategory = 'Core' | 'Productivity' | 'Analytics' | 'Development' | 'Utilities';

export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: AppCategory;
  /** Whether the app is a core system app that cannot be uninstalled */
  isCore?: boolean;
}

export const APP_REGISTRY: Record<string, AppDefinition> = {
  'dashboard': {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Central overview and control panel.',
    icon: CompassIcon,
    category: 'Core',
    isCore: true,
  },
  'lifecycle': {
    id: 'lifecycle',
    name: 'Lifecycle',
    description: 'Track software development lifecycle stages.',
    icon: ListIcon,
    category: 'Productivity',
  },
  'analytics': {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data analytics and reporting tools.',
    icon: ChartBarIcon,
    category: 'Analytics',
  },
  'projects': {
    id: 'projects',
    name: 'Projects',
    description: 'Manage and track ongoing projects.',
    icon: FolderIcon,
    category: 'Productivity',
  },
  'team': {
    id: 'team',
    name: 'Team',
    description: 'Manage team members and permissions.',
    icon: UsersIcon,
    category: 'Core',
  },
  'documents': {
    id: 'documents',
    name: 'Documents',
    description: 'Data library, reports, and document management.',
    icon: DatabaseIcon,
    category: 'Productivity',
  },
  'showcase': {
    id: 'showcase',
    name: 'UI Showcase',
    description: 'Component library showcase for developers.',
    icon: CompassIcon,
    category: 'Development',
  },
  'error-pages': {
    id: 'error-pages',
    name: 'Error Pages Simulator',
    description: 'Test environment for various HTTP error states.',
    icon: AlertTriangleIcon,
    category: 'Development',
  }
};
