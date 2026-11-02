import { useSiteInfo } from '@/services/site/site.queries'

export const useOpeningStatus = () => {
  const { data: site } = useSiteInfo()
  return { isOpen: site?.isOpen ?? false, todayHours: site?.todayHours ?? '' }
}
