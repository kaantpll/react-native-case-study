import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Error } from '@/components/Error';
import { FilterBar } from '@/components/FilterBar';
import { HeaderActions } from '@/components/HeaderActions';
import { Loading } from '@/components/Loading';
import { SearchInput } from '@/components/SearchInput';
import { TaskModal } from '@/components/task/TaskModal';
import { TasksList } from '@/components/task/TasksList';
import { TasksStats } from '@/components/TasksStats';
import { useFetchListById } from '@/hooks/useLists';
import {
  useFetchTasksByList,
  useFetchTasks,
  useSearchTasksByName,
  useCreateTask,
} from '@/hooks/useTasks';
import { useModalStore } from '@/store/modalStore';

export default function Details() {
  const { id } = useLocalSearchParams();
  const listId = parseInt(id as string, 10);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'pending' | 'completed' | 'upcoming' | 'high'
  >('all');
  const [showFilters, setShowFilters] = useState(false);

  const { openTaskModal } = useModalStore();
  const createTask = useCreateTask();
  const { data: list, isLoading: isListLoading, error: listError } = useFetchListById(listId);
  const {
    data: tasks,
    isLoading: isTasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useFetchTasksByList(listId);
  const { refetch: refetchAllTasks } = useFetchTasks();
  const { data: searchResults = [], isLoading: isSearchLoading } = useSearchTasksByName(searchTerm);

  const handleRefreshTasks = async () => {
    await refetchTasks();
    await refetchAllTasks();
  };

  const tasksToShow = useMemo(() => {
    if (searchTerm.trim()) {
      return searchResults.filter((task) => task.list_id === listId);
    }

    const listTasks = tasks || [];

    switch (filterType) {
      case 'pending':
        return listTasks.filter((task) => !task.is_completed);
      case 'completed':
        return listTasks.filter((task) => task.is_completed);
      case 'upcoming':
        return listTasks.filter((task) => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          const today = new Date();
          return dueDate > today && !task.is_completed;
        });
      case 'high':
        return listTasks.filter((task) => task.priority === 'high');
      default:
        return listTasks;
    }
  }, [searchTerm, searchResults, tasks, filterType, listId]);

  const handleFilterChange = (filter: typeof filterType) => {
    setFilterType(filter);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const isLoading = isListLoading || isTasksLoading;
  const isError = listError || tasksError;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message="Failed to load list or tasks" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: list?.name ?? '',
          headerRight: () => <HeaderActions onToggleFilters={handleToggleFilters} />,
        }}
      />
      <Container>
        <SearchInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search tasks..."
        />

        {showFilters && (
          <FilterBar
            filterType={filterType}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
          />
        )}

        <TasksStats
          totalTasks={tasksToShow.length}
          completedTasks={tasks?.filter((t) => t.is_completed).length || 0}
          pendingTasks={tasks?.filter((t) => !t.is_completed).length || 0}
          filterType={filterType}
        />

        <TasksList
          tasks={tasksToShow}
          refetch={handleRefreshTasks}
          isSearching={searchTerm.trim().length > 0 && isSearchLoading}
        />

        <TaskModal listId={listId} />

        <Button
          title="Create Task"
          onPress={() => openTaskModal({})}
          isLoading={createTask.isPending}
        />
      </Container>
    </>
  );
}
