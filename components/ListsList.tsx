import React, { useState } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';

import { ListCard } from './ListCard';

import { List } from '@/types';

interface ListsListProps {
  lists: List[];
  refetch: () => void;
}

export const ListsList = ({ lists, refetch }: ListsListProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (lists.length === 0) {
    return (
      <View className={styles.emptyContainer}>
        <Text className={styles.emptyText}>No lists yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={lists}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ListCard list={item} />}
      className={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
      }
    />
  );
};

const styles = {
  emptyContainer: 'flex-1 items-center justify-center',
  emptyText: 'lg text-gray-500',
  list: 'flex-1',
};
