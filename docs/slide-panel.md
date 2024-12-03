# SlidePanel Component Documentation

## Overview
SlidePanel - это универсальный компонент для отображения выдвигающейся панели с динамическим контентом. Панель может быть вызвана из любого места в приложении и содержать любой React компонент.

## Основные преимущества
- 🌍 **Глобальная доступность**: Может быть вызвана из любого компонента приложения
- 🔄 **Динамический контент**: Поддерживает отображение любого React компонента
- 🎯 **Централизованное управление**: Единое место управления состоянием панели
- ✨ **Встроенная анимация**: Плавное появление и исчезновение панели

## Архитектура

### 1. Контекст (SlidePanelContext)
Управляет глобальным состоянием панели:
```javascript
// context/SlidePanelContext.js
const SlidePanelContext = createContext(null);

export const SlidePanelProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openPanel = useCallback((content) => {
    setContent(content);
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300);
  }, []);

  return (
    <SlidePanelContext.Provider value={{ openPanel, closePanel }}>
      {children}
      <SlidePanel isOpen={isOpen} onClose={closePanel}>
        {content}
      </SlidePanel>
    </SlidePanelContext.Provider>
  );
};
```

### 2. Компонент панели (SlidePanel)
Отвечает за отображение и анимацию:
```javascript
// components/common/SlidePanel.js
const SlidePanel = ({ isOpen, onClose, children }) => {
  return (
    <div className={`slide-panel ${isOpen ? 'open' : ''}`}>
      <div className="slide-panel-content">
        {children}
      </div>
    </div>
  );
};
```

## Как использовать

### 1. Подключение в приложении
```javascript
// App.js
import { SlidePanelProvider } from './context/SlidePanelContext';

const App = () => {
  return (
    <SlidePanelProvider>
      {/* Ваше приложение */}
    </SlidePanelProvider>
  );
};
```

### 2. Использование в компонентах
```javascript
// YourComponent.js
import { useSlidePanel } from '../context/SlidePanelContext';

const YourComponent = () => {
  const { openPanel } = useSlidePanel();

  const handleOpenPanel = () => {
    openPanel(
      <div>
        <h2>Ваш контент</h2>
        <p>Любой React компонент</p>
      </div>
    );
  };

  return (
    <button onClick={handleOpenPanel}>
      Открыть панель
    </button>
  );
};
```

### 3. Пример с пользовательским компонентом
```javascript
const CustomPanel = ({ data }) => {
  return (
    <div className="custom-panel">
      <h2>{data.title}</h2>
      <div className="content">
        {data.content}
      </div>
    </div>
  );
};

const ParentComponent = () => {
  const { openPanel } = useSlidePanel();

  const showDetails = (data) => {
    openPanel(<CustomPanel data={data} />);
  };

  return (
    <button onClick={() => showDetails({ title: 'Детали', content: 'Содержимое' })}>
      Показать детали
    </button>
  );
};
```

## Стилизация
Базовые стили панели:
```css
/* styles/common/slide-panel.css */
.slide-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
}

.slide-panel.open {
  right: 0;
}

.slide-panel-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}
```

## Лучшие практики

1. **Закрытие панели**
```javascript
const YourPanel = () => {
  const { closePanel } = useSlidePanel();
  
  return (
    <div>
      <button onClick={closePanel}>Закрыть</button>
      {/* Контент */}
    </div>
  );
};
```

2. **Очистка при закрытии**
Контент автоматически очищается после закрытия панели (с небольшой задержкой для анимации).

3. **Предотвращение множественных открытий**
```javascript
const SafeComponent = () => {
  const { openPanel } = useSlidePanel();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const data = await fetchData();
      openPanel(<DataPanel data={data} />);
    } finally {
      setIsLoading(false);
    }
  };
};
```

## Примеры использования

### 1. Панель настроек
```javascript
const SettingsPanel = () => {
  const { closePanel } = useSlidePanel();
  
  return (
    <div className="settings-panel">
      <h2>Настройки</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        // Сохранение настроек
        closePanel();
      }}>
        {/* Форма настроек */}
      </form>
    </div>
  );
};
```

### 2. Детали элемента
```javascript
const ItemDetails = ({ id }) => {
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchItem(id).then(setItem);
  }, [id]);

  if (!item) return <div>Загрузка...</div>;

  return (
    <div className="item-details">
      <h2>{item.title}</h2>
      <div className="details">{item.details}</div>
    </div>
  );
};
```

## Заключение
SlidePanel предоставляет гибкий и переиспользуемый способ отображения дополнительного контента в вашем приложении. Благодаря контексту React и модульной архитектуре, панель легко интегрируется в любую часть приложения и может содержать любой требуемый контент.
