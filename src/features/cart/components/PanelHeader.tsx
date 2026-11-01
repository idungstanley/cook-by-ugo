import { ArrowLeft } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { CloseButton } from '@/components/ui/Overlay'

interface PanelHeaderProps {
  title: string
  onClose: () => void
}

/** Back arrow on phones, where the panel fills the screen, and a close button on larger screens. */
export const PanelHeader = ({ title, onClose }: PanelHeaderProps) => (
  <div className="flex items-center gap-3 px-5 pb-2 pt-5 sm:justify-between sm:px-8 sm:pt-8">
    <IconButton label="Back" onClick={onClose} className="sm:hidden">
      <ArrowLeft className="size-5" />
    </IconButton>
    <h2 className="text-3xl">{title}</h2>
    <CloseButton onClick={onClose} className="hidden sm:grid" />
  </div>
)
