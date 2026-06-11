import { isTauri } from '@tauri-apps/api/core';

/**
 * Checks if the application is running in a Desktop environment (Tauri).
 * 
 * Future-proofing: Tauri v2 supports both Desktop and Mobile (Android/iOS).
 * We check the user agent to ensure we don't accidentally apply Desktop-only 
 * UI (like Window Controls, Resize Handles) on a Tauri Mobile app.
 */
export const isDesktop = (): boolean => {
  if (!isTauri()) return false;

  // Simple synchronous check for mobile user agents
  const ua = navigator.userAgent.toLowerCase();
  const isMobileOS = ua.includes('android') || ua.includes('iphone') || ua.includes('ipad');

  return !isMobileOS;
};

/**
 * Checks if the application is running in a standard Web Browser.
 */
export const isWeb = (): boolean => {
  return !isTauri();
};
