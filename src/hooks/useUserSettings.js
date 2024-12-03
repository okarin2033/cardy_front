import { useState, useEffect } from 'react';

const DEFAULT_TARGET_LANGUAGE = 'RUSSIAN';

export const useUserSettings = () => {
  const [settings, setSettings] = useState({
    targetLanguage: DEFAULT_TARGET_LANGUAGE,
  });

  // В будущем здесь будет загрузка настроек с сервера
  useEffect(() => {
    // Временная заглушка
    setSettings({
      targetLanguage: DEFAULT_TARGET_LANGUAGE,
    });
  }, []);

  return settings;
};
