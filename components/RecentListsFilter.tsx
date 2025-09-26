import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';

interface RecentListsFilterProps {
  showRecent: boolean;
  onToggleRecent: () => void;
  recentLimit: number;
  onLimitChange: (limit: number) => void;
}

export const RecentListsFilter = ({
  showRecent,
  onToggleRecent,
  recentLimit,
  onLimitChange,
}: RecentListsFilterProps) => {
  const [limitInput, setLimitInput] = useState(recentLimit.toString());

  const handleLimitChange = (text: string) => {
    setLimitInput(text);
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 50) {
      onLimitChange(numValue);
    }
  };

  return (
    <View className={styles.container}>
      <TouchableOpacity
        onPress={onToggleRecent}
        className={showRecent ? styles.toggleButtonActive : styles.toggleButton}>
        <Text className={showRecent ? styles.toggleTextActive : styles.toggleText}>
          Recent Lists
        </Text>
      </TouchableOpacity>

      {showRecent && (
        <View className={styles.limitContainer}>
          <TextInput
            value={limitInput}
            onChangeText={handleLimitChange}
            placeholder="5"
            className={styles.limitInput}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text className={styles.limitLabel}>items</Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: 'mb-4 gap-2 flex-row',
  toggleButton: 'bg-gray-200 px-4 py-2 rounded-lg flex-row items-center justify-center',
  toggleButtonActive: 'bg-blue-500 px-4 py-2 rounded-lg flex-row items-center justify-center',
  toggleText: 'text-gray-700 font-medium',
  toggleTextActive: 'text-white font-medium',
  limitContainer: 'flex-row items-center justify-center gap-2',
  limitLabel: 'text-gray-600',
  limitInput: 'border border-gray-300 rounded px-3 py-1 text-center w-12 bg-white',
};
