import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { EmptyState } from '../EmptyState';
import { ListCard } from './ListCard';
import { Loading } from '../Loading';

import { List } from '@/types';

interface ListsListProps {
  lists: List[];
  refetch: () => void;
  isSearching?: boolean;
}

export const ListsList = ({ lists, refetch, isSearching = false }: ListsListProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  if (isSearching) {
    return <Loading />;
  }

  if (lists.length === 0) {
    return <EmptyState title="No lists yet" description="Create your first list to get started" />;
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
  list: 'flex-1',
};
