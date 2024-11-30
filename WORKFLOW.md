# Ru Nihongo Study - Руководство по разработке

## Структура проекта
frontend/
  ├── src/
  │   ├── components/      # React компоненты
  │   │   ├── DeckList.js    # Список колод
  │   │   ├── CardList.js    # Список карточек
  │   │   ├── Review.js      # Компонент повторения
  │   │   └── Profile.js     # Профиль пользователя
  │   ├── context/        # React контексты
  │   │   ├── AuthContext.js # Контекст авторизации
  │   │   └── ThemeContext.js # Контекст темы
  │   ├── styles/         # CSS стили
  │   └── axiosConfig.js  # Конфигурация axios

## Ключевые компоненты

### 1. Review.js
```javascript
// Основные хуки
const { deckId } = useParams();  // Получение ID колоды из URL
const navigate = useNavigate();   // Для навигации
const location = useLocation();   // Для определения режима
const isLearningMode = location.pathname.includes('/learn');

// Состояния
const [cardsToReview, setCardsToReview] = useState([]);
const [showBack, setShowBack] = useState(false);
const [currentCardIndex, setCurrentCardIndex] = useState(0);

// API запросы
const fetchCards = async () => {
  const mode = isLearningMode ? 'mixed' : 'review_only';
  const response = await axios.get(`review/cards/study/${deckId}`, {
    params: { mode }
  });
};

// Обработка действий
const handleReviewAction = async (action) => {
  await axios.post('review/cards', {
    userCardId: currentCard.cardId,
    action: action
  });
};
```

### 2. CardList.js
```javascript
// URL параметры
const { deckId } = useParams();
const navigate = useNavigate();

// API интеграция
const fetchCards = async () => {
  const response = await axios.get(`cards/deck/${deckId}/user`);
};

const handleAddCard = async (cardData) => {
  await axios.post('cards', {
    ...cardData,
    deckId: deckId
  });
};
```

## Лучшие практики

### 1. Маршрутизация
- Всегда используйте React Router для навигации
- Определяйте все маршруты централизованно в App.js
- Используйте параметры URL вместо состояния где возможно
- Не забывайте обрабатывать несуществующие маршруты

### 2. Работа с API
- Всегда используйте try-catch для запросов
- Показывайте состояние загрузки
- Обрабатывайте ошибки и показывайте их пользователю
- Используйте axios interceptors для общей логики

### 3. Стилизация
- Используйте CSS переменные для темы
- Придерживайтесь БЭМ-подобной структуры классов
- Группируйте стили по компонентам
- Поддерживайте темную тему

### 4. Состояние
- Используйте локальное состояние для UI
- Контексты для глобальных данных
- Избегайте излишней вложенности состояний
- Правильно обрабатывайте сброс состояния

## Важные моменты
1. **Авторизация**
   - Токен хранится в httpOnly cookie
   - Проверяйте авторизацию перед запросами
   - Обрабатывайте истечение токена

2. **Производительность**
   - Используйте useMemo для тяжелых вычислений
   - Не делайте лишних ререндеров
   - Правильно используйте useEffect

3. **UX/UI**
   - Всегда показывайте состояние загрузки
   - Давайте понятную обратную связь
   - Поддерживайте все интерактивные элементы

## Работа с компонентами

### Review компонент
1. Режимы работы:
   - Повторение (review)
   - Изучение (learn)
2. Интеграции:
   - AI объяснения
   - Словарь
   - Подсказки
3. Стили:
   - Анимации карточек
   - Адаптивный дизайн
   - Поддержка тем

### CardList компонент
1. Функционал:
   - CRUD операции
   - Фильтрация и поиск
   - Сортировка
2. Оптимизация:
   - Пагинация
   - Кэширование
   - Дебаунс поиска

## Обработка ошибок
```javascript
try {
  // API запрос
} catch (error) {
  if (error.response) {
    // Ошибка от сервера
    setError(error.response.data.message);
  } else if (error.request) {
    // Нет ответа
    setError('Сервер не отвечает');
  } else {
    // Ошибка запроса
    setError('Ошибка при выполнении запроса');
  }
}
```

## Переменные окружения
```env
REACT_APP_API_URL=http://localhost:8080/v1
```

## Чеклист при разработке
1. Проверить работу с API
2. Протестировать маршрутизацию
3. Проверить темную тему
4. Проверить мобильную версию
5. Убедиться в корректной обработке ошибок
6. Проверить производительность
7. Протестировать edge cases