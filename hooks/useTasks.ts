import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  searchTasksByName,
  getTasksByStatus,
  getTasksByPriority,
  getUpcomingTasks,
  getCompletedTasks,
  getTasksByListId,
} from '@/queries/tasks';
import { Task } from '@/types';
import { TaskInput, TaskUpdateInput } from '@/utils/validations';

const Services = {
  fetchTasks: async () => await getAllTasks(),
  getTaskById: async (id: number) => await getTaskById(id),
  createTask: async (taskData: TaskInput) => await createTask(taskData),
  updateTask: async (id: number, updates: TaskUpdateInput) => await updateTask(id, updates),
  deleteTask: async (id: number) => await deleteTask(id),
  toggleTaskCompletion: async (id: number, isCompleted: boolean) =>
    await toggleTaskCompletion(id, isCompleted),
  searchTasksByName: async (searchTerm: string) => await searchTasksByName(searchTerm),
  getTasksByStatus: async (status: string) => await getTasksByStatus(status),
  getTasksByPriority: async (priority: string) => await getTasksByPriority(priority),
  getUpcomingTasks: async () => await getUpcomingTasks(),
  getCompletedTasks: async () => await getCompletedTasks(),
  getTasksByListId: async (listId: number) => await getTasksByListId(listId),
};

export const useFetchTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['TASKS'],
    queryFn: () => Services.fetchTasks(),
  });
};

export const useFetchTasksByList = (listId: number) => {
  return useQuery<Task[]>({
    queryKey: ['TASKS', 'LIST', listId],
    queryFn: () => Services.getTasksByListId(listId),
    enabled: !!listId,
  });
};

export const useFetchTaskById = (id: number) => {
  return useQuery<Task | undefined>({
    queryKey: ['TASKS', 'TASK', id],
    queryFn: () => Services.getTaskById(id),
    enabled: !!id,
  });
};

export const useSearchTasksByName = (searchTerm: string) => {
  return useQuery<Task[]>({
    queryKey: ['TASKS', 'SEARCH', searchTerm],
    queryFn: () => Services.searchTasksByName(searchTerm),
    enabled: !!searchTerm.trim(),
  });
};

export const useFetchTasksByStatus = (status: string) => {
  return useQuery<Task[]>({
    queryKey: ['TASKS', 'STATUS', status],
    queryFn: () => Services.getTasksByStatus(status),
    enabled: !!status,
  });
};

export const useFetchTasksByPriority = (priority: string) => {
  return useQuery<Task[]>({
    queryKey: ['TASKS', 'PRIORITY', priority],
    queryFn: () => Services.getTasksByPriority(priority),
    enabled: !!priority,
  });
};

export const useFetchUpcomingTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['TASKS', 'UPCOMING'],
    queryFn: () => Services.getUpcomingTasks(),
  });
};

export const useFetchCompletedTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['TASKS', 'COMPLETED'],
    queryFn: () => Services.getCompletedTasks(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskData: TaskInput) => Services.createTask(taskData),

    onMutate: async (taskData: TaskInput) => {
      await queryClient.cancelQueries({ queryKey: ['TASKS'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['TASKS']);

      const tempTask = {
        id: Date.now() * -1,
        ...taskData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as Task;

      queryClient.setQueryData<Task[] | undefined>(['TASKS'], (old) =>
        old ? [...old, tempTask] : [tempTask]
      );

      if (taskData.list_id) {
        const listKey = ['TASKS', 'LIST', taskData.list_id];
        queryClient.setQueryData<Task[] | undefined>(listKey, (old) =>
          old ? [...old, tempTask] : [tempTask]
        );
      }

      return { previousTasks };
    },
    onError: (_err, _taskData, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['TASKS'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['TASKS'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: TaskUpdateInput }) =>
      Services.updateTask(id, updates),

    onMutate: async ({ id, updates }: { id: number; updates: TaskUpdateInput }) => {
      await queryClient.cancelQueries({ queryKey: ['TASKS'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['TASKS']);

      queryClient.setQueryData<Task[] | undefined>(['TASKS'], (old) =>
        old ? old.map((t) => (t.id === id ? { ...t, ...updates } : t)) : old
      );

      const queryCache = queryClient.getQueryCache();
      queryCache.getAll().forEach((query) => {
        if (query.queryKey[0] === 'TASKS' && query.queryKey[1] === 'LIST') {
          const listData = queryClient.getQueryData<Task[]>(query.queryKey);
          if (listData) {
            queryClient.setQueryData<Task[]>(
              query.queryKey,
              listData.map((t) => (t.id === id ? { ...t, ...updates } : t))
            );
          }
        }
      });

      return { previousTasks };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['TASKS'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['TASKS'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => Services.deleteTask(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['TASKS'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['TASKS']);

      queryClient.setQueryData<Task[] | undefined>(['TASKS'], (old) =>
        old ? old.filter((t) => t.id !== id) : old
      );

      return { previousTasks };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['TASKS'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['TASKS'] });
    },
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) =>
      Services.toggleTaskCompletion(id, isCompleted),

    onMutate: async ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
      await queryClient.cancelQueries({ queryKey: ['TASKS'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['TASKS']);

      queryClient.setQueryData<Task[] | undefined>(['TASKS'], (old) =>
        old ? old.map((t) => (t.id === id ? { ...t, is_completed: isCompleted } : t)) : old
      );

      return { previousTasks };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['TASKS'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['TASKS'] });
    },
  });
};
