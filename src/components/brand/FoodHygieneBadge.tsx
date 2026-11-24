import { cn } from '@/lib/cn'

/** The Food Standards Agency listing for Cooked by Ugo. */
const RATING_URL = 'https://ratings.food.gov.uk/business/1957822/cooked-by-ugo---jollof-grill'

/**
 * The official FSA online badge, unaltered as the FSA requires. It must show the current
 * rating: if a new inspection changes it, swap `fhrs-badge-5` for the new number.
 */
const BADGE_URL = 'https://ratings.food.gov.uk/embed/badges/fhrs/3/fhrs-badge-5.svg'

export const FoodHygieneBadge = ({ className }: { className?: string }) => (
  <a
    href={RATING_URL}
    target="_blank"
    rel="noreferrer"
    className={cn(
      'inline-block rounded-xl bg-white p-2 shadow-sm transition hover:scale-[1.02]',
      className,
    )}
  >
    <img
      src={BADGE_URL}
      alt="Food hygiene rating 5, very good. Inspected September 2026. See the full rating on the Food Standards Agency website."
      width={291}
      height={162}
      loading="lazy"
      className="h-auto w-full max-w-[240px]"
    />
  </a>
)
