import { create } from 'zustand'
import type { CheckoutStep } from '@/constants/checkout'
import type { DeliveryDetails, Order } from '@/types'

interface CheckoutState {
  step: CheckoutStep
  delivery: DeliveryDetails | null
  order: Order | null
  setStep: (step: CheckoutStep) => void
  saveDelivery: (delivery: DeliveryDetails) => void
  completeOrder: (order: Order) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 'delivery',
  delivery: null,
  order: null,
  setStep: (step) => set({ step }),
  saveDelivery: (delivery) => set({ delivery, step: 'payment' }),
  completeOrder: (order) => set({ order, step: 'done' }),
  reset: () => set({ step: 'delivery', order: null }),
}))
