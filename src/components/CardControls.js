import React from 'react';
import { SORT_OPTIONS, FILTER_OPTIONS } from '../types/cards.js';

const CardControls = ({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange
}) => {
  return (
    <div className="card-controls">
      <div className="control-group">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="">Сортировка</option>
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filterBy}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-select"
        >
          {FILTER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CardControls;
