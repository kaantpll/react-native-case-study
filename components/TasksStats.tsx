import React from 'react';
import { View, Text } from 'react-native';

interface TasksStatsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  filterType: string;
}

export const TasksStats = ({
  totalTasks,
  completedTasks,
  pendingTasks,
  filterType,
}: TasksStatsProps) => {
  return (
    <View className={styles.container}>
      <Text className={styles.totalText}>
        {totalTasks} {filterType === 'all' ? 'tasks' : filterType}
      </Text>
      <View className={styles.statsContainer}>
        <Text className={styles.statText}>{completedTasks} completed</Text>
        <Text className={styles.statText}>{pendingTasks} pending</Text>
      </View>
    </View>
  );
};

const styles = {
  container: 'mb-4 flex-row items-center justify-between px-4',
  totalText: 'text-lg font-semibold text-gray-800',
  statsContainer: 'flex-row items-center gap-4',
  statText: 'text-sm text-gray-500',
};
