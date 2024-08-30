import { MineClass } from "@/classes/MineClass";
import { create } from "zustand";

interface UIState {
  modal: boolean;
  setModal: (modal: boolean) => void;
  modalContent: { content: React.ReactNode | null; mine: MineClass | null };
  setModalContent: (modalContent: React.ReactNode, mine: MineClass) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modal: false,
  setModal: (modal: boolean) => set({ modal }),
  modalContent: { content: null, mine: null },
  setModalContent: (modalContent: React.ReactNode, mine: MineClass) =>
    set((state) => ({
      modalContent: { content: modalContent, mine },
    })),
}));
