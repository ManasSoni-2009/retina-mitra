'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  theme: 'Light' | 'Dark' | 'System';
  fontSize: 'Small' | 'Medium' | 'Large';
  highContrast: boolean;
  detectionSensitivity: number;
  autoGenerateReport: boolean;
  defaultReportFormat: 'Detailed' | 'Summary' | 'Raw CSV';
  retinaImageQuality: 'High' | 'Standard';
  specialistThreshold: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'Light',
  fontSize: 'Medium',
  highContrast: false,
  detectionSensitivity: 65,
  autoGenerateReport: true,
  defaultReportFormat: 'Detailed',
  retinaImageQuality: 'High',
  specialistThreshold: 70,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'rm_active_settings_v2';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Apply DOM side-effects
  const applyDomEffects = useCallback((cfg: AppSettings) => {
    if (typeof document === 'undefined') return;

    // 1. Theme
    if (cfg.theme === 'Dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // 2. Font Size
    const sizeMap: Record<string, string> = { Small: '13px', Medium: '16px', Large: '19px' };
    document.documentElement.style.fontSize = sizeMap[cfg.fontSize] || '16px';
    document.documentElement.setAttribute('data-font-size', cfg.fontSize.toLowerCase());

    // 3. High Contrast
    if (cfg.highContrast) {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
    }
  }, []);

  // Load on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(merged);
        applyDomEffects(merged);
      } else {
        applyDomEffects(DEFAULT_SETTINGS);
      }
    } catch (e) {
      console.error('Settings load error:', e);
    }
  }, [applyDomEffects]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Settings save error:', e);
      }
      applyDomEffects(next);
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Settings reset error:', e);
    }
    applyDomEffects(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
