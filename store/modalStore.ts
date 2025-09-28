import { create } from 'zustand';

import { Task } from '@/types';

interface ModalState {
  isVisible: boolean;
  isEdit: boolean;
  editingList: { id: number; name: string } | null;
  isTaskModalVisible: boolean;
  taskModalData: { task?: Task; listId?: number } | null;
  openCreate: () => void;
  openEdit: (list: { id: number; name: string }) => void;
  close: () => void;
  openTaskModal: (data: { task?: Task; listId?: number }) => void;
  closeTaskModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isVisible: false,
  isEdit: false,
  editingList: null,
  isTaskModalVisible: false,
  taskModalData: null,
  openCreate: () => set({ isVisible: true, isEdit: false, editingList: null }),
  openEdit: (list) => set({ isVisible: true, isEdit: true, editingList: list }),
  close: () => set({ isVisible: false, isEdit: false, editingList: null }),
  openTaskModal: (data) => set({ isTaskModalVisible: true, taskModalData: data }),
  closeTaskModal: () => set({ isTaskModalVisible: false, taskModalData: null }),
}));
