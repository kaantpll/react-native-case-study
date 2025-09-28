import { act, renderHook } from '@testing-library/react-hooks';

import { useStore } from '../../store/store';
import { List, Task } from '../../types';

describe('useStore', () => {
  beforeEach(() => {
    act(() => {
      const store = useStore.getState();
      store.setTasks([]);
      store.setLists([]);
      store.setLoading(false);
      store.setError(null);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useStore());

      expect(result.current.tasks).toEqual([]);
      expect(result.current.lists).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('tasks operations', () => {
    const mockTask: Task = {
      id: 1,
      name: 'Test Task',
      description: 'Test Description',
      image: null,
      status: 'pending',
      priority: 'high',
      is_completed: false,
      due_date: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      list_id: 1,
    };

    it('should set tasks', () => {
      const { result } = renderHook(() => useStore());
      const tasks = [mockTask];

      act(() => {
        result.current.setTasks(tasks);
      });

      expect(result.current.tasks).toEqual(tasks);
    });

    it('should add task', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toEqual(mockTask);
    });

    it('should add multiple tasks', () => {
      const { result } = renderHook(() => useStore());
      const secondTask = { ...mockTask, id: 2, name: 'Second Task' };

      act(() => {
        result.current.addTask(mockTask);
        result.current.addTask(secondTask);
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[1]).toEqual(secondTask);
    });

    it('should update task', () => {
      const { result } = renderHook(() => useStore());
      const updatedTask = { ...mockTask, name: 'Updated Task' };

      act(() => {
        result.current.addTask(mockTask);
        result.current.updateTask(updatedTask);
      });

      expect(result.current.tasks[0]).toEqual(updatedTask);
      expect(result.current.tasks[0].name).toBe('Updated Task');
    });

    it('should not update non-existent task', () => {
      const { result } = renderHook(() => useStore());
      const nonExistentTask = { ...mockTask, id: 999 };

      act(() => {
        result.current.addTask(mockTask);
        result.current.updateTask(nonExistentTask);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toEqual(mockTask);
    });

    it('should remove task', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.addTask(mockTask);
        result.current.removeTask(mockTask.id);
      });

      expect(result.current.tasks).toHaveLength(0);
    });

    it('should not remove non-existent task', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.addTask(mockTask);
        result.current.removeTask(999);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toEqual(mockTask);
    });
  });

  describe('lists operations', () => {
    const mockList: List = {
      id: 1,
      name: 'Test List',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should set lists', () => {
      const { result } = renderHook(() => useStore());
      const lists = [mockList];

      act(() => {
        result.current.setLists(lists);
      });

      expect(result.current.lists).toEqual(lists);
    });

    it('should add list', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.addList(mockList);
      });

      expect(result.current.lists).toHaveLength(1);
      expect(result.current.lists[0]).toEqual(mockList);
    });

    it('should update list', () => {
      const { result } = renderHook(() => useStore());
      const updatedList = { ...mockList, name: 'Updated List' };

      act(() => {
        result.current.addList(mockList);
        result.current.updateList(updatedList);
      });

      expect(result.current.lists[0]).toEqual(updatedList);
      expect(result.current.lists[0].name).toBe('Updated List');
    });

    it('should remove list', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.addList(mockList);
        result.current.removeList(mockList.id);
      });

      expect(result.current.lists).toHaveLength(0);
    });
  });

  describe('loading and error states', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.loading).toBe(false);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useStore());
      const errorMessage = 'Something went wrong';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('complex operations', () => {
    it('should handle multiple operations correctly', () => {
      const { result } = renderHook(() => useStore());
      const mockTask: Task = {
        id: 1,
        name: 'Test Task',
        description: 'Test Description',
        image: null,
        status: 'pending',
        priority: 'high',
        is_completed: false,
        due_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        list_id: 1,
      };
      const mockList: List = {
        id: 1,
        name: 'Test List',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      act(() => {
        result.current.setLoading(true);
        result.current.addList(mockList);
        result.current.addTask(mockTask);
        result.current.setLoading(false);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.lists).toHaveLength(1);
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.error).toBe(null);
    });
  });
});
