import { Stagger } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDeals } from '@/services/deals/deals.queries'
import { DealCard } from './DealCard'

export const Deals = () => {
  const { data: deals, isPending } = useDeals()

  return (
    <section id="deals" className="py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Save more, chop more" title="Deals worth" accent="sharing." />
        <Stagger gap={0.12} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-[370px]" />
              ))
            : deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)}
        </Stagger>
      </Container>
    </section>
  )
}
