import { useState, useEffect } from 'react';

export interface Settings {
  showDailyVerse: boolean;
  glowEffects: boolean;
  compactMode: boolean;
}

const STORAGE_KEY = 'habit_tracker_settings';

const defaultSettings: Settings = {
  showDailyVerse: true,
  glowEffects: true,
  compactMode: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { settings, updateSettings };
};