import { motion } from 'motion/react'
import { Stagger } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CARD_HOVER, fadeUp } from '@/constants/motion'
import { Stars } from '@/features/reviews/StarRating'
import { useReviews } from '@/services/reviews/reviews.queries'

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

/** Real reviews from delivered orders. Hidden until there are some to show. */
export const Reviews = () => {
  const { data } = useReviews()
  if (!data || data.summary.count === 0) return null
  const { summary, reviews } = data

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Reviews" title="Newcastle has" accent="spoken." />
          <div className="flex items-center gap-4">
            <p className="font-display text-6xl font-extrabold leading-none">
              {summary.average.toFixed(1)}
            </p>
            <div>
              <Stars rating={summary.average} />
              <p className="text-sm text-muted">
                from {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <Stagger className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((review) => (
              <motion.figure
                key={review.id}
                variants={fadeUp}
                whileHover={CARD_HOVER}
                className="flex flex-col gap-3 rounded-card bg-paper p-5 shadow-sm"
              >
                <Stars rating={review.rating} />
                <blockquote className="text-cocoa/90">“{review.comment}”</blockquote>
                {review.reply && (
                  <p className="border-l-2 border-jollof pl-3 text-sm text-muted">
                    <strong className="text-cocoa">Ugo:</strong> {review.reply}
                  </p>
                )}
                <figcaption className="mt-auto text-sm font-semibold">
                  {review.displayName}{' '}
                  <span className="font-normal text-muted">
                    · {dateFormat.format(review.createdAt)}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </Stagger>
        )}
      </Container>
    </section>
  )
}
