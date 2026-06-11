import { Store } from '@tanstack/react-store';
import { APP_REGISTRY } from '../config/registry';

// Get default installed apps (core apps are always installed)
const defaultInstalledApps = Object.values(APP_REGISTRY)
  .filter(app => app.isCore)
  .map(app => app.id);

export interface LauncherState {
  installedApps: string[];
}

// Ensure Core Apps are always in the installed list
const enforceCoreApps = (apps: string[]) => {
  const coreApps = Object.values(APP_REGISTRY).filter(a => a.isCore).map(a => a.id);
  const combined = new Set([...apps, ...coreApps]);
  return Array.from(combined);
};

// Initialize from localStorage if available
const loadState = (): LauncherState => {
  try {
    const stored = localStorage.getItem('kbm-launcher-state');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { installedApps: enforceCoreApps(parsed.installedApps || []) };
    }
  } catch (e) {
    console.error('Failed to load launcher state', e);
  }
  return { installedApps: defaultInstalledApps };
};

export const launcherStore = new Store<LauncherState>(loadState());

// Subscribe to state changes and persist to localStorage
launcherStore.subscribe(() => {
  try {
    localStorage.setItem('kbm-launcher-state', JSON.stringify(launcherStore.state));
  } catch (e) {
    console.error('Failed to save launcher state', e);
  }
});

export const launcherActions = {
  installApp: (appId: string) => {
    launcherStore.setState((state) => {
      if (state.installedApps.includes(appId)) return state;
      return {
        ...state,
        installedApps: [...state.installedApps, appId],
      };
    });
  },
  
  uninstallApp: (appId: string) => {
    // Prevent uninstalling core apps
    const app = APP_REGISTRY[appId];
    if (app?.isCore) return;

    launcherStore.setState((state) => ({
      ...state,
      installedApps: state.installedApps.filter((id) => id !== appId),
    }));
  },
  
  isInstalled: (appId: string) => {
    return launcherStore.state.installedApps.includes(appId);
  }
};
