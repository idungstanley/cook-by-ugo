import { motion } from 'motion/react'
import { FoodHygieneBadge } from '@/components/brand/FoodHygieneBadge'
import { Stagger } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CARD_HOVER, fadeUp } from '@/constants/motion'
import { Stars } from '@/features/reviews/StarRating'
import { useReviews } from '@/services/reviews/reviews.queries'

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

/** Trust in one place: the council's hygiene rating, then what customers say. */
export const Reviews = () => {
  const { data } = useReviews()
  const summary = data?.summary
  const reviews = data?.reviews ?? []

  return (
    <section id="reviews" className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Reviews"
            title="Rated 5 for hygiene,"
            accent="loved by Newcastle."
          />
          <div className="flex flex-wrap items-center gap-6">
            <FoodHygieneBadge className="w-44 md:w-52" />
            {summary && summary.count > 0 && (
              <div className="flex items-center gap-3">
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
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <Stagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    · {review.source ? `on ${review.source}, ` : ''}
                    {dateFormat.format(review.createdAt)}
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
