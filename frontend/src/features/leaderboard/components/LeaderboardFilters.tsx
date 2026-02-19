import React from 'react';
import type { FilterType } from '../types';
import { FilterGroup, FilterButton } from './LeaderboardFilters.styles';

interface LeaderboardFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <FilterGroup>
      <FilterButton
        $active={currentFilter === 'daily'}
        onClick={() => onFilterChange('daily')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Daily
      </FilterButton>
      <FilterButton
        $active={currentFilter === 'lifetime'}
        onClick={() => onFilterChange('lifetime')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Lifetime
      </FilterButton>
    </FilterGroup>
  );
};

export default LeaderboardFilters;
