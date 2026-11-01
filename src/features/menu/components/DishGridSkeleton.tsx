import { Skeleton } from '@/components/ui/Skeleton'

export const DishGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }, (_, index) => (
      <Skeleton key={index} className="h-80" />
    ))}
  </div>
)
