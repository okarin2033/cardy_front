/**
 * @typedef {Object} UserCard
 * @property {number} cardId
 * @property {string} front
 * @property {string} back
 * @property {string} hint
 * @property {boolean} isNew
 * @property {number} stability
 * @property {number} difficulty
 * @property {string} lastReviewed
 * @property {string} nextReview
 */

/**
 * @typedef {Object} CardSortOption
 * @property {'difficulty' | 'nextReview' | 'stability'} value
 * @property {string} label
 */

/**
 * @typedef {Object} CardFilterOption
 * @property {'all' | 'new' | 'review' | 'easy' | 'medium' | 'hard'} value
 * @property {string} label
 */

export const SORT_OPTIONS = [
  { value: 'difficulty', label: 'По сложности' },
  { value: 'nextReview', label: 'По времени повторения' },
  { value: 'stability', label: 'По стабильности' }
];

export const FILTER_OPTIONS = [
  { value: 'all', label: 'Все карточки' },
  { value: 'new', label: 'Новые' },
  { value: 'review', label: 'Для повторения' },
  { value: 'easy', label: 'Легкие' },
  { value: 'medium', label: 'Средние' },
  { value: 'hard', label: 'Сложные' }
];
