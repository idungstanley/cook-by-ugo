import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Read-only stars, with half-filled ones rounded to the nearest whole star. */
export const Stars = ({ rating, className }: { rating: number; className?: string }) => (
  <span
    role="img"
    aria-label={`${rating} out of 5 stars`}
    className={cn('inline-flex gap-0.5', className)}
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        aria-hidden
        className={cn('size-4', star <= Math.round(rating) ? 'fill-gold text-gold' : 'text-line')}
      />
    ))}
  </span>
)

interface StarPickerProps {
  value: number
  onChange: (rating: number) => void
}

const LABELS = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent']

export const StarPicker = ({ value, onChange }: StarPickerProps) => (
  <fieldset>
    <legend className="sr-only">Your rating</legend>
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <label
          key={star}
          className="cursor-pointer rounded-full p-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-jollof"
        >
          <input
            type="radio"
            name="rating"
            value={star}
            checked={value === star}
            onChange={() => onChange(star)}
            className="sr-only"
          />
          <span className="sr-only">{LABELS[star - 1]}</span>
          <Star
            aria-hidden
            className={cn(
              'size-9 transition hover:scale-110',
              star <= value ? 'fill-gold text-gold' : 'text-muted/40',
            )}
          />
        </label>
      ))}
      {value > 0 && <span className="ml-2 text-sm font-semibold">{LABELS[value - 1]}</span>}
    </div>
  </fieldset>
)
