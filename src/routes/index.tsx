import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/layout/Footer'
import { Deals } from '@/features/home/components/Deals'
import { DishTicker } from '@/features/home/components/DishTicker'
import { Favourites } from '@/features/home/components/Favourites'
import { FindUs } from '@/features/home/components/FindUs'
import { Hero } from '@/features/home/components/Hero'
import { HowItWorks } from '@/features/home/components/HowItWorks'
import { OurStory } from '@/features/home/components/OurStory'
import { Reviews } from '@/features/home/components/Reviews'
import { dealsQuery } from '@/services/deals/deals.queries'
import {
  categoriesQuery,
  dishesQuery,
  favouritesQuery,
  optionGroupsQuery,
} from '@/services/menu/menu.queries'

const HomePage = () => (
  <>
    <Hero />
    <DishTicker />
    <Favourites />
    <OurStory />
    <Deals />
    <HowItWorks />
    <Reviews />
    <FindUs />
    <Footer />
  </>
)

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(dishesQuery),
      queryClient.ensureQueryData(categoriesQuery),
      queryClient.ensureQueryData(favouritesQuery),
      queryClient.ensureQueryData(optionGroupsQuery),
      queryClient.ensureQueryData(dealsQuery),
    ]),
  component: HomePage,
})
