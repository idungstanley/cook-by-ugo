import { ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TextAreaField } from '@/components/ui/fields'
import { cn } from '@/lib/cn'
import { useSubmitReview } from '@/services/reviews/reviews.queries'
import type { OrderLine } from '@/types'
import { StarPicker } from './StarRating'

interface ReviewFormProps {
  orderId: string
  trackingKey: string
  items: OrderLine[]
}

export const ReviewForm = ({ orderId, trackingKey, items }: ReviewFormProps) => {
  const submit = useSubmitReview()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState<string[]>([])
  const dishNames = [...new Set(items.map(({ name }) => name))]

  const toggleLiked = (name: string) =>
    setLiked((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )

  return (
    <form
      id="review"
      className="flex scroll-mt-24 flex-col gap-4 rounded-card bg-gold-soft p-5"
      onSubmit={(event) => {
        event.preventDefault()
        submit.mutate({
          orderId,
          trackingKey,
          input: { rating, comment: comment.trim() || undefined, likedItems: liked },
        })
      }}
    >
      <div>
        <h2 className="text-2xl">How was your food?</h2>
        <p className="text-sm text-muted">Your review helps Ugo, and other hungry people too.</p>
      </div>
      <StarPicker value={rating} onChange={setRating} />

      {rating > 0 && (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">What did you love? (optional)</legend>
            <div className="flex flex-wrap gap-2">
              {dishNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={liked.includes(name)}
                  onClick={() => toggleLiked(name)}
                  className={cn(
                    'inline-flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition',
                    liked.includes(name)
                      ? 'border-ewedu bg-ewedu text-white'
                      : 'border-cocoa/20 bg-paper hover:border-cocoa/50',
                  )}
                >
                  <ThumbsUp className="size-4" /> {name}
                </button>
              ))}
            </div>
          </fieldset>
          <TextAreaField
            label="Tell us more (optional)"
            placeholder="The jollof was smoky and the portion was generous..."
            rows={3}
            maxLength={1000}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="bg-paper"
          />
        </>
      )}

      {submit.error && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {submit.error.message}
        </p>
      )}
      <Button type="submit" disabled={rating === 0 || submit.isPending} className="self-start">
        {submit.isPending ? 'Sending...' : 'Send review'}
      </Button>
    </form>
  )
}
