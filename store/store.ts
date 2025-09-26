import { create } from 'zustand';

import { Task, List } from '@/types';

interface AppState {
  tasks: Task[];
  lists: List[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setLists: (lists: List[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: number) => void;
  addList: (list: List) => void;
  updateList: (list: List) => void;
  removeList: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  tasks: [],
  lists: [],
  loading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  setLists: (lists) => set({ lists }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
  updateList: (list) =>
    set((state) => ({
      lists: state.lists.map((l) => (l.id === list.id ? list : l)),
    })),
  removeList: (id) =>
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
