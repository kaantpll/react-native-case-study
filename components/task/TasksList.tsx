import { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';

import { EmptyState } from '../EmptyState';
import { Loading } from '../Loading';
import { TaskCard } from './TaskCard';

import { Task } from '@/types';

interface TasksListProps {
  tasks: Task[];
  refetch: () => void;
  isSearching?: boolean;
}

export const TasksList = ({ tasks, refetch, isSearching = false }: TasksListProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  if (isSearching) {
    return <Loading />;
  }

  if (tasks.length === 0) {
    return <EmptyState title="No tasks yet" description="Create your first task to get started" />;
  }

  return (
    <View className={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TaskCard task={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#6366f1" />
        }
      />
    </View>
  );
};

const styles = {
  container: 'flex-1  pt-6',
};
