import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/cn'
import { IconButton } from './IconButton'

interface OverlayProps {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  className?: string
}

const BASE = 'overflow-hidden bg-paper p-0 text-cocoa shadow-panel backdrop:bg-cocoa/50'

/** Slides in from the right on desktop and fills the screen on mobile. */
export const Drawer = ({ open, onClose, label, children, className }: OverlayProps) => {
  const { dialogRef, dialogProps } = useDialog(open, onClose)

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      className={cn(
        BASE,
        'ml-auto mr-0 h-dvh max-h-none w-full max-w-none animate-slide-in sm:w-[520px] sm:rounded-l-panel',
        className,
      )}
      {...dialogProps}
    >
      {open && <div className="flex h-full flex-col overflow-y-auto">{children}</div>}
    </dialog>
  )
}

/** Centred pop-up on desktop, bottom sheet on mobile. */
export const Modal = ({ open, onClose, label, children, className }: OverlayProps) => {
  const { dialogRef, dialogProps } = useDialog(open, onClose)

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      className={cn(
        BASE,
        'mb-0 mt-auto max-h-[94dvh] w-full max-w-none animate-sheet-in rounded-t-panel',
        'md:m-auto md:w-[calc(100%-3rem)] md:max-w-[1040px] md:animate-pop-in md:rounded-panel',
        className,
      )}
      {...dialogProps}
    >
      {open && children}
    </dialog>
  )
}

export const CloseButton = ({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) => (
  <IconButton label="Close" onClick={onClick} className={cn('bg-shea', className)}>
    <X className="size-5" strokeWidth={2.5} />
  </IconButton>
)
