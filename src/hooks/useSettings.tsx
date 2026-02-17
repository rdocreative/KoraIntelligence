import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetData: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('app_settings', JSON.stringify(updated));
      
      if (newSettings.glowEffects !== undefined) {
        if (newSettings.glowEffects) {
          document.documentElement.classList.remove('no-glow');
        } else {
          document.documentElement.classList.add('no-glow');
        }
      }
      
      return updated;
    });
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetData }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings deve ser usado dentro de um SettingsProvider");
  }
  return context;
};