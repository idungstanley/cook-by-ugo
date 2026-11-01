import { LogoMark } from '@/components/brand/LogoMark'
import { Container } from '@/components/ui/Container'
import { useOpeningStatus } from '@/hooks/useOpeningStatus'
import { cn } from '@/lib/cn'

export const CompactFooter = ({ className }: { className?: string }) => {
  const { todayHours } = useOpeningStatus()

  return (
    <footer className={cn('bg-cocoa text-shea', className)}>
      <Container className="flex flex-col gap-2 py-8 md:flex-row md:items-center md:justify-between">
        <LogoMark onDark className="size-20" />
        <span className="text-sm text-shea/80">
          Open today {todayHours} · Delivering across NE postcodes
        </span>
      </Container>
    </footer>
  )
}
