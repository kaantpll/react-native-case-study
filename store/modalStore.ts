import { create } from 'zustand';

interface ModalState {
  isVisible: boolean;
  isEdit: boolean;
  editingList: { id: number; name: string } | null;
  openCreate: () => void;
  openEdit: (list: { id: number; name: string }) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isVisible: false,
  isEdit: false,
  editingList: null,
  openCreate: () => set({ isVisible: true, isEdit: false, editingList: null }),
  openEdit: (list) => set({ isVisible: true, isEdit: true, editingList: list }),
  close: () => set({ isVisible: false, isEdit: false, editingList: null }),
}));
