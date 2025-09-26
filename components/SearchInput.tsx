import React from 'react';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClearSearch?: () => void;
}

export const SearchInput = ({
  value,
  onChangeText,
  placeholder = 'Search lists...',
  onClearSearch,
}: SearchInputProps) => {
  const handleClearSearch = () => {
    onChangeText('');
    onClearSearch?.();
  };

  return (
    <View className={styles.container}>
      <View className={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} className={styles.clearButton}>
            <Text className={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = {
  container: 'mb-4',
  inputContainer: 'flex-row items-center gap-2',
  input: 'flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base bg-white',
  clearButton: 'w-8 h-8 bg-gray-300 rounded-full items-center justify-center',
  clearIcon: 'text-sm text-gray-600 font-bold',
};
