import { useState, useEffect } from 'react';

export type UserSettings = {
  userName: string;
  showDailyVerse: boolean;
  glowEffects: boolean;
  notificationsEnabled: boolean;
};

const DEFAULT_SETTINGS: UserSettings = {
  userName: "Marcos Eduardo",
  showDailyVerse: true,
  glowEffects: true,
  notificationsEnabled: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar configurações", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('app_settings', JSON.stringify(updated));
    
    // Aplicar classes globais para efeitos de brilho
    if (newSettings.glowEffects !== undefined) {
      if (newSettings.glowEffects) {
        document.documentElement.classList.remove('no-glow');
      } else {
        document.documentElement.classList.add('no-glow');
      }
    }
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return { settings, updateSettings, resetData };
};