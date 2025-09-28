import { Stack } from 'expo-router';
import { useState, useMemo } from 'react';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Error } from '@/components/Error';
import { ListModal } from '@/components/list/ListModal';
import { ListsList } from '@/components/list/ListsList';
import { Loading } from '@/components/Loading';
import { RecentListsFilter } from '@/components/RecentListsFilter';
import { SearchInput } from '@/components/SearchInput';
import { useFetchLists, useSearchLists, useRecentLists, useCreateList } from '@/hooks/useLists';
import { useModalStore } from '@/store/modalStore';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [recentLimit, setRecentLimit] = useState(5);
  const {
    data: allLists = [],
    refetch,
    isError: isListError,
    isLoading: isListLoading,
  } = useFetchLists();
  const { data: searchResults = [], isLoading: isSearchLoading } = useSearchLists(searchTerm);
  const { data: recentLists = [], isLoading: isRecentLoading } = useRecentLists(recentLimit);
  const { openCreate } = useModalStore();
  const createList = useCreateList();

  const listsToShow = useMemo(() => {
    if (searchTerm.trim()) {
      return searchResults;
    }
    return showRecent ? recentLists : allLists;
  }, [searchTerm, searchResults, allLists, showRecent, recentLists]);

  const handleToggleView = () => {
    setShowRecent(!showRecent);
  };

  const handleLimitChange = (limit: number) => {
    setRecentLimit(limit);
  };

  const isLoading = isListLoading;
  const isError = isListError;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message="Failed to load lists" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Lists' }} />
      <Container>
        <SearchInput value={searchTerm} onChangeText={setSearchTerm} />
        <RecentListsFilter
          showRecent={showRecent}
          onToggleRecent={handleToggleView}
          recentLimit={recentLimit}
          onLimitChange={handleLimitChange}
        />
        <ListsList
          lists={listsToShow}
          refetch={refetch}
          isSearching={(searchTerm.trim().length > 0 && isSearchLoading) || isRecentLoading}
        />
        <Button title="Create List" onPress={openCreate} isLoading={createList.isPending} />
      </Container>
      <ListModal />
    </>
  );
}
