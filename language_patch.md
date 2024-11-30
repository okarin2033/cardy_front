# Доработка функционала языков

## 1. Создание типов

```typescript
// src/types/language.ts
export interface LanguageEnum {
  code: 'JAPANESE' | 'ENGLISH' | 'RUSSIAN';
  value: string;
}

export type LanguageCode = 'JAPANESE' | 'ENGLISH' | 'RUSSIAN';
```

## 2. API Сервис

```typescript
// src/services/languageService.ts
import axios from '../axiosConfig';
import { LanguageEnum } from '../types/language';

export const LanguageService = {
  getLanguages: async (): Promise<LanguageEnum[]> => {
    const response = await axios.get('/v1/api/enums/languages');
    return response.data;
  }
};
```

## 3. Контекст для языков

```typescript
// src/context/LanguageContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { LanguageEnum } from '../types/language';
import { LanguageService } from '../services/languageService';

interface LanguageContextType {
  languages: LanguageEnum[];
  loading: boolean;
  error: string | null;
  getLanguageValue: (code: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC = ({ children }) => {
  const [languages, setLanguages] = useState<LanguageEnum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const data = await LanguageService.getLanguages();
      setLanguages(data);
    } catch (err) {
      setError('Ошибка загрузки языков');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageValue = (code: string): string => {
    const language = languages.find(lang => lang.code === code);
    return language?.value || code;
  };

  return (
    <LanguageContext.Provider value={{ languages, loading, error, getLanguageValue }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

## 4. Компонент выбора языка

```typescript
// src/components/common/LanguageSelect.tsx
import React from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { LanguageCode } from '../types/language';

interface LanguageSelectProps {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  disabled?: boolean;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const { languages, loading } = useLanguageContext();

  if (loading) {
    return <div>Загрузка языков...</div>;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as LanguageCode)}
      disabled={disabled}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.value}
        </option>
      ))}
    </select>
  );
};
```

## 5. План внедрения

1. Создать файлы:
   - [ ] `src/types/language.ts`
   - [ ] `src/services/languageService.ts`
   - [ ] `src/context/LanguageContext.tsx`
   - [ ] `src/components/common/LanguageSelect.tsx`

2. Обновить `App.tsx`:
   - [ ] Добавить `LanguageProvider` в дерево провайдеров

3. Обновить существующие компоненты:
   - [ ] Заменить хардкод языков на использование `LanguageSelect`
   - [ ] Использовать `getLanguageValue` для отображения названий языков

4. Тестирование:
   - [ ] Проверить загрузку списка языков
   - [ ] Проверить работу селекта языков
   - [ ] Проверить отображение названий языков
   - [ ] Проверить обработку ошибок

## 6. Стилизация

```css
/* src/styles/components/LanguageSelect.css */
.language-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
}

.language-select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.language-select option {
  background-color: var(--card-bg);
  color: var(--text-color);
}
```

## 7. Дополнительные улучшения

- [ ] Добавить иконки для языков
- [ ] Реализовать кэширование списка языков
- [ ] Добавить анимацию при загрузке языков
- [ ] Добавить поиск по списку языков при большом количестве опций
