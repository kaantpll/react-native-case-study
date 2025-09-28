import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

interface HeaderActionsProps {
  onToggleFilters: () => void;
}

export const HeaderActions = ({ onToggleFilters }: HeaderActionsProps) => {
  return (
    <View className={styles.container}>
      <TouchableOpacity onPress={onToggleFilters} className={styles.filterButton}>
        <MaterialIcons name="filter-list" size={24} color="#6366F1" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: 'flex-row gap-2',
  filterButton: 'rounded-lg bg-gray-100 p-2',
};
