import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ErrorMessage, StatusMessage } from '@/components/ui/StatusMessage'
import { DishGridSkeleton } from '@/features/menu/components/DishGridSkeleton'
import { OffersStrip } from '@/features/offers/OffersStrip'
import { MenuFilters } from '@/features/menu/components/MenuFilters'
import { MenuSectionList } from '@/features/menu/components/MenuSectionList'
import { MobileBasketBar } from '@/features/menu/components/MobileBasketBar'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useMenuSections } from '@/hooks/useMenuSections'
import {
  categoriesQuery,
  dishesQuery,
  favouritesQuery,
  optionGroupsQuery,
} from '@/services/menu/menu.queries'
import type { CategoryId } from '@/types'

interface MenuSearch {
  category?: CategoryId
}

const CATEGORY_IDS: CategoryId[] = ['rice-swallow', 'grills-protein', 'sides-snacks', 'drinks']

const MenuPage = () => {
  const { category } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const { categories, sections, counts, isPending, isError, refetch } = useMenuSections(
    category,
    debouncedSearch,
  )

  const changeCategory = (next: CategoryId | undefined) =>
    void navigate({ search: { category: next }, replace: true, resetScroll: false })

  const clearFilters = () => {
    setSearch('')
    changeCategory(undefined)
  }

  return (
    <>
      <Container className="pb-12 pt-4 md:pb-20 md:pt-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-jollof">
              The menu
            </p>
            <h1 className="text-[2.75rem] leading-[1.02] md:text-7xl">
              Everything,
              <span className="block font-accent font-semibold italic tracking-normal text-jollof">
                <span className="md:hidden">from the pot.</span>
                <span className="hidden md:inline">straight from the pot.</span>
              </span>
            </h1>
          </div>
          <p className="hidden max-w-sm text-cocoa/80 md:block">
            Every dish is cooked fresh from traditional Nigerian recipes. Pick a protein, add your
            sides, done.
          </p>
        </div>

        <OffersStrip className="mt-6" />

        <div className="sticky top-[76px] z-10 -mx-5 mt-6 bg-shea/95 px-5 py-2 backdrop-blur md:top-[88px] md:mx-0 md:mt-10 md:bg-transparent md:px-0 md:backdrop-blur-none">
          <MenuFilters
            categories={categories}
            counts={counts}
            activeCategory={category}
            onCategoryChange={changeCategory}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        <div className="mt-6 md:mt-12">
          {isError ? (
            <ErrorMessage onRetry={refetch} />
          ) : isPending ? (
            <DishGridSkeleton count={8} />
          ) : sections.length === 0 ? (
            <StatusMessage
              title="No dishes match that"
              body="Try a different search, or see the full menu."
              action={<Button onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <MenuSectionList sections={sections} />
          )}
        </div>
      </Container>
      <MobileBasketBar />
      <CompactFooter className="max-md:pb-20" />
    </>
  )
}

export const Route = createFileRoute('/menu')({
  validateSearch: (search: Record<string, unknown>): MenuSearch => ({
    category: CATEGORY_IDS.find((id) => id === search.category),
  }),
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(dishesQuery),
      queryClient.ensureQueryData(categoriesQuery),
      queryClient.ensureQueryData(favouritesQuery),
      queryClient.ensureQueryData(optionGroupsQuery),
    ]),
  head: () => ({ meta: [{ title: 'Menu · Cooked by Ugo' }] }),
  component: MenuPage,
})
