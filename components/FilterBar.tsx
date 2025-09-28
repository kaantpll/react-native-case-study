import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

type FilterType = 'all' | 'pending' | 'completed' | 'upcoming' | 'high';

interface FilterBarProps {
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  showFilters: boolean;
}

interface FilterButtonProps {
  label: string;
  value: FilterType;
  isActive: boolean;
  onPress: () => void;
}

const FilterButton = ({ label, value, isActive, onPress }: FilterButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={isActive ? styles.filterButtonActive : styles.filterButton}>
    <Text className={isActive ? styles.filterTextActive : styles.filterText}>{label}</Text>
  </TouchableOpacity>
);

export const FilterBar = ({ filterType, onFilterChange }: FilterBarProps) => {
  const handleFilterChange = (filter: FilterType) => {
    onFilterChange(filter);
  };

  return (
    <View className={styles.container}>
      <View className={styles.row}>
        <FilterButton
          label="All"
          value="all"
          isActive={filterType === 'all'}
          onPress={() => handleFilterChange('all')}
        />
        <FilterButton
          label="Pending"
          value="pending"
          isActive={filterType === 'pending'}
          onPress={() => handleFilterChange('pending')}
        />
        <FilterButton
          label="Completed"
          value="completed"
          isActive={filterType === 'completed'}
          onPress={() => handleFilterChange('completed')}
        />
      </View>

      <View className={styles.row}>
        <FilterButton
          label="Upcoming"
          value="upcoming"
          isActive={filterType === 'upcoming'}
          onPress={() => handleFilterChange('upcoming')}
        />
        <FilterButton
          label="High Priority"
          value="high"
          isActive={filterType === 'high'}
          onPress={() => handleFilterChange('high')}
        />
      </View>
    </View>
  );
};

const styles = {
  container: 'mb-4 ',
  row: 'mb-3 flex-row gap-2',
  filterButton: 'rounded-lg px-3 py-2 bg-gray-100',
  filterButtonActive: 'rounded-lg px-3 py-2 border border-indigo-300 bg-indigo-100',
  filterText: 'text-sm font-medium text-gray-700',
  filterTextActive: 'text-sm font-medium text-indigo-700',
};
