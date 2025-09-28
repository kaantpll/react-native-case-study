import React from 'react';
import { View, Text, TextInput as RNTextInput, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  isTextArea?: boolean;
}

export const TextInput = ({
  label,
  error,
  containerClassName = '',
  inputClassName = '',
  isTextArea = false,
  ...props
}: CustomTextInputProps) => {
  const baseInputStyle = isTextArea ? styles.textArea : styles.input;
  const errorStyle = error ? styles.inputError : '';

  return (
    <View className={`${styles.container} ${containerClassName}`}>
      {label && <Text className={styles.label}>{label}</Text>}
      <RNTextInput
        className={`${baseInputStyle} ${errorStyle} ${inputClassName}`}
        placeholderTextColor="#9CA3AF"
        textAlignVertical={isTextArea ? 'top' : 'center'}
        {...props}
      />
      {error && (
        <View className={styles.errorContainer}>
          <Text className={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: 'mb-6',
  label: 'mb-2 text-sm font-medium text-gray-700',
  input:
    'bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 focus:border-indigo-500 focus:bg-white',
  textArea:
    'bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 focus:border-indigo-500 focus:bg-white min-h-[80px]',
  inputError: 'border-red-400 bg-red-50 focus:border-red-500',
  errorContainer: 'mt-2',
  errorText: 'text-sm font-medium text-red-500',
};
