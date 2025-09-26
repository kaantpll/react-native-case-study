import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getAllLists,
  getListById,
  createList,
  updateList,
  deleteList,
  searchListsByName,
  getRecentLists,
} from '@/queries/lists';
import { List } from '@/types';

const Services = {
  fetchLists: async () => await getAllLists(),
  getListById: async (id: number) => await getListById(id),
  createList: async (name: string) => await createList(name),
  updateList: async (id: number, name: string) => await updateList(id, name),
  deleteList: async (id: number) => await deleteList(id),
  searchListsByName: async (name: string) => await searchListsByName(name),
  getRecentLists: async (limit: number) => await getRecentLists(limit),
};

export const useFetchLists = () => {
  return useQuery<List[]>({
    queryKey: ['LISTS'],
    queryFn: () => Services.fetchLists(),
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => Services.createList(name),

    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: ['LISTS'] });

      const previousLists = queryClient.getQueryData<List[]>(['LISTS']);

      const tempList = {
        id: Date.now() * -1,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as List;

      queryClient.setQueryData<List[] | undefined>(['LISTS'], (old) =>
        old ? [...old, tempList] : [tempList]
      );

      return { previousLists };
    },
    onError: (_err, _name, context: any) => {
      if (context?.previousLists) {
        queryClient.setQueryData(['LISTS'], context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['LISTS'] });
    },
  });
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => Services.updateList(id, name),

    onMutate: async ({ id, name }: { id: number; name: string }) => {
      await queryClient.cancelQueries({ queryKey: ['LISTS'] });

      const previousLists = queryClient.getQueryData<List[]>(['LISTS']);

      queryClient.setQueryData<List[] | undefined>(['LISTS'], (old) =>
        old ? old.map((l) => (l.id === id ? { ...l, name } : l)) : old
      );

      return { previousLists };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousLists) {
        queryClient.setQueryData(['LISTS'], context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['LISTS'] });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => Services.deleteList(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['LISTS'] });

      const previousLists = queryClient.getQueryData<List[]>(['LISTS']);

      queryClient.setQueryData<List[] | undefined>(['LISTS'], (old) =>
        old ? old.filter((l) => l.id !== id) : old
      );

      return { previousLists };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previousLists) {
        queryClient.setQueryData(['LISTS'], context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['LISTS'] });
    },
  });
};
