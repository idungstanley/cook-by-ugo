import { useMemo } from 'react'
import { useSiteInfo } from '@/services/site/site.queries'

export const useOpeningStatus = () => {
  const { data: site } = useSiteInfo()

  return useMemo(() => {
    const now = new Date()
    const today = site?.hours.find(({ days }) => days.includes(now.getDay()))
    const hour = now.getHours()
    const isOpen = Boolean(today && hour >= today.opensAtHour && hour < today.closesAtHour)

    return { isOpen, todayHours: today?.hoursLabel ?? '' }
  }, [site])
}
