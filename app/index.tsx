import { Stack } from 'expo-router';
import { useState, useMemo } from 'react';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { ListModal } from '@/components/ListModal';
import { ListsList } from '@/components/ListsList';
import { RecentListsFilter } from '@/components/RecentListsFilter';
import { SearchInput } from '@/components/SearchInput';
import { useFetchLists, useSearchLists, useRecentLists } from '@/hooks/useLists';
import { useModalStore } from '@/store/modalStore';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [recentLimit, setRecentLimit] = useState(5);
  const { data: allLists = [], refetch } = useFetchLists();
  const { data: searchResults = [] } = useSearchLists(searchTerm);
  const { data: recentLists = [] } = useRecentLists(recentLimit);
  const { openCreate } = useModalStore();

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
        <ListsList lists={listsToShow} refetch={refetch} />
        <Button title="Create List" onPress={openCreate} />
      </Container>
      <ListModal />
    </>
  );
}
