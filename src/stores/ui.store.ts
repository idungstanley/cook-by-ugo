import { create } from 'zustand'

type Panel = 'cart' | 'checkout' | null

interface UiState {
  activeDishId: string | null
  panel: Panel
  isMobileMenuOpen: boolean
  openDish: (dishId: string) => void
  closeDish: () => void
  openPanel: (panel: Exclude<Panel, null>) => void
  closePanel: () => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  activeDishId: null,
  panel: null,
  isMobileMenuOpen: false,
  openDish: (activeDishId) => set({ activeDishId }),
  closeDish: () => set({ activeDishId: null }),
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
}))
