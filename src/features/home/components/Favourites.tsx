import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { buttonStyles } from '@/components/ui/button.styles'
import { Chip } from '@/components/ui/Chip'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { DishCard } from '@/features/menu/components/DishCard'
import { DishGridSkeleton } from '@/features/menu/components/DishGridSkeleton'
import { useCategories, useDishes, useFavourites } from '@/services/menu/menu.queries'
import type { CategoryId } from '@/types'

const CARDS_SHOWN = 4

export const Favourites = () => {
  const [category, setCategory] = useState<CategoryId>()
  const { data: categories } = useCategories()
  const { data: dishes, isPending } = useDishes()
  const { data: favourites } = useFavourites()

  const cards = useMemo(() => {
    if (category) {
      return (dishes ?? [])
        .filter((dish) => dish.categoryId === category)
        .slice(0, CARDS_SHOWN)
        .map((dish) => ({ dish }))
    }
    return (favourites ?? []).flatMap(({ dishId, tag, description }) => {
      const dish = dishes?.find(({ id }) => id === dishId)
      return dish ? [{ dish, tag, description }] : []
    })
  }, [category, dishes, favourites])

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Most ordered"
          title="Tonight's favourites,"
          accent="straight from the pot."
        />

        <div className="mb-6 mt-6 flex items-center justify-between gap-4">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
            <Chip active={!category} onClick={() => setCategory(undefined)}>
              All
            </Chip>
            {categories?.map(({ id, shortName }) => (
              <Chip key={id} active={category === id} onClick={() => setCategory(id)}>
                {shortName}
              </Chip>
            ))}
          </div>
          <Link
            to="/menu"
            className={buttonStyles({ variant: 'outline', className: 'hidden md:inline-flex' })}
          >
            Full menu →
          </Link>
        </div>

        {isPending ? (
          <DishGridSkeleton />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {cards.map(({ dish, ...card }) => (
              <DishCard key={dish.id} dish={dish} layout="row" {...card} />
            ))}
          </div>
        )}

        <Link
          to="/menu"
          className={buttonStyles({
            variant: 'outline',
            fullWidth: true,
            className: 'mt-6 md:hidden',
          })}
        >
          Full menu →
        </Link>
      </Container>
    </section>
  )
}
