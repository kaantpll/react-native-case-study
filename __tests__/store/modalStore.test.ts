import { act, renderHook } from '@testing-library/react-hooks';

import { useModalStore } from '../../store/modalStore';

describe('useModalStore', () => {
  beforeEach(() => {
    act(() => {
      useModalStore.getState().close();
      useModalStore.getState().closeTaskModal();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useModalStore());

      expect(result.current.isVisible).toBe(false);
      expect(result.current.isEdit).toBe(false);
      expect(result.current.editingList).toBe(null);
      expect(result.current.isTaskModalVisible).toBe(false);
      expect(result.current.taskModalData).toBe(null);
    });
  });

  describe('list modal actions', () => {
    it('should open create modal', () => {
      const { result } = renderHook(() => useModalStore());

      act(() => {
        result.current.openCreate();
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.isEdit).toBe(false);
      expect(result.current.editingList).toBe(null);
    });

    it('should open edit modal with list data', () => {
      const { result } = renderHook(() => useModalStore());
      const mockList = { id: 1, name: 'Test List' };

      act(() => {
        result.current.openEdit(mockList);
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.isEdit).toBe(true);
      expect(result.current.editingList).toEqual(mockList);
    });

    it('should close list modal', () => {
      const { result } = renderHook(() => useModalStore());
      const mockList = { id: 1, name: 'Test List' };

      act(() => {
        result.current.openEdit(mockList);
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.isEdit).toBe(true);
      expect(result.current.editingList).toEqual(mockList);

      // Then close it
      act(() => {
        result.current.close();
      });

      expect(result.current.isVisible).toBe(false);
      expect(result.current.isEdit).toBe(false);
      expect(result.current.editingList).toBe(null);
    });
  });

  describe('task modal actions', () => {
    it('should open task modal with list id', () => {
      const { result } = renderHook(() => useModalStore());
      const mockData = { listId: 1 };

      act(() => {
        result.current.openTaskModal(mockData);
      });

      expect(result.current.isTaskModalVisible).toBe(true);
      expect(result.current.taskModalData).toEqual(mockData);
    });

    it('should open task modal with task data', () => {
      const { result } = renderHook(() => useModalStore());
      const mockTask = {
        id: 1,
        name: 'Test Task',
        description: 'Test Description',
        is_completed: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        list_id: 1,
      };
      const mockData = { task: mockTask };

      act(() => {
        result.current.openTaskModal(mockData);
      });

      expect(result.current.isTaskModalVisible).toBe(true);
      expect(result.current.taskModalData).toEqual(mockData);
    });

    it('should open task modal with both task and list id', () => {
      const { result } = renderHook(() => useModalStore());
      const mockTask = {
        id: 1,
        name: 'Test Task',
        description: 'Test Description',
        is_completed: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        list_id: 1,
      };
      const mockData = { task: mockTask, listId: 2 };

      act(() => {
        result.current.openTaskModal(mockData);
      });

      expect(result.current.isTaskModalVisible).toBe(true);
      expect(result.current.taskModalData).toEqual(mockData);
    });

    it('should close task modal', () => {
      const { result } = renderHook(() => useModalStore());
      const mockData = { listId: 1 };

      act(() => {
        result.current.openTaskModal(mockData);
      });

      expect(result.current.isTaskModalVisible).toBe(true);
      expect(result.current.taskModalData).toEqual(mockData);

      act(() => {
        result.current.closeTaskModal();
      });

      expect(result.current.isTaskModalVisible).toBe(false);
      expect(result.current.taskModalData).toBe(null);
    });
  });

  describe('independent modal states', () => {
    it('should handle both modals open at the same time', () => {
      const { result } = renderHook(() => useModalStore());
      const mockList = { id: 1, name: 'Test List' };
      const mockTaskData = { listId: 2 };

      act(() => {
        result.current.openEdit(mockList);
        result.current.openTaskModal(mockTaskData);
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.isEdit).toBe(true);
      expect(result.current.editingList).toEqual(mockList);
      expect(result.current.isTaskModalVisible).toBe(true);
      expect(result.current.taskModalData).toEqual(mockTaskData);
    });

    it('should close modals independently', () => {
      const { result } = renderHook(() => useModalStore());
      const mockList = { id: 1, name: 'Test List' };
      const mockTaskData = { listId: 2 };

      act(() => {
        result.current.openEdit(mockList);
        result.current.openTaskModal(mockTaskData);
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.isVisible).toBe(false);
      expect(result.current.isTaskModalVisible).toBe(true);

      act(() => {
        result.current.closeTaskModal();
      });

      expect(result.current.isTaskModalVisible).toBe(false);
    });
  });
});
