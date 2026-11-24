import { Skeleton } from '@/components/ui/Skeleton'

export const DishGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
    {Array.from({ length: count }, (_, index) => (
      <Skeleton key={index} className="h-40" />
    ))}
  </div>
)
