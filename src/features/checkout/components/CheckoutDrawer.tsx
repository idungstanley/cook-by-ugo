import { CloseButton, Modal } from '@/components/ui/Overlay'
import { PanelHeader } from '@/features/cart/components/PanelHeader'
import { useCheckoutStore } from '@/stores/checkout.store'
import { useUiStore } from '@/stores/ui.store'
import { CheckoutProgress } from './CheckoutProgress'
import { ConfirmationStep } from './ConfirmationStep'
import { DeliveryStep } from './DeliveryStep'
import { PaymentStep } from './PaymentStep'

export const CheckoutDrawer = () => {
  const open = useUiStore((state) => state.panel === 'checkout')
  const closePanel = useUiStore((state) => state.closePanel)
  const step = useCheckoutStore((state) => state.step)
  const order = useCheckoutStore((state) => state.order)
  const reset = useCheckoutStore((state) => state.reset)

  const close = () => {
    closePanel()
    if (step === 'done') reset()
  }

  return (
    // Centred and roomy on larger screens, like Uber Eats, and full screen on phones.
    <Modal
      open={open}
      onClose={close}
      label="Checkout"
      className="h-[94dvh] md:h-[min(880px,92dvh)] md:max-w-[720px]"
    >
      <div className="flex h-full flex-col overflow-y-auto">
        {step === 'done' && order ? (
          <>
            <div className="flex justify-end px-5 pt-5 sm:px-8 sm:pt-8">
              <CloseButton onClick={close} />
            </div>
            <ConfirmationStep order={order} onDone={close} />
          </>
        ) : (
          <>
            <PanelHeader title="Checkout" onClose={close} />
            <div className="px-5 pb-4 pt-3 sm:px-8">
              <CheckoutProgress current={step} />
            </div>
            {step === 'delivery' ? <DeliveryStep /> : <PaymentStep />}
          </>
        )}
      </div>
    </Modal>
  )
}
