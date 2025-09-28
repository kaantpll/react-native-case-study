import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      {description && <Text className={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = {
  container: 'flex-1 items-center justify-center py-12',
  title: 'text-lg font-semibold text-gray-700 mt-4',
  description: 'text-sm text-gray-500 mt-2 text-center',
};
