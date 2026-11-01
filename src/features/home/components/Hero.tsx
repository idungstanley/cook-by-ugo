import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { HERO_STATS } from '@/constants/content'
import { useOpeningStatus } from '@/hooks/useOpeningStatus'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { useDishes } from '@/services/menu/menu.queries'
import { useUiStore } from '@/stores/ui.store'

const HERO_DISH_ID = 'party-jollof-rice'

const HeroDishChip = () => {
  const { data: dishes } = useDishes()
  const openDish = useUiStore((state) => state.openDish)
  const dish = dishes?.find(({ id }) => id === HERO_DISH_ID)

  if (!dish) return null

  return (
    <div className="absolute bottom-[8%] left-[-4%] hidden items-center gap-3 rounded-2xl bg-paper p-2.5 pr-3 shadow-float lg:flex">
      <img src={dish.image} alt="" className="size-14 rounded-xl object-cover" />
      <div>
        <p className="font-display font-bold leading-tight">{dish.name}</p>
        <p className="text-xs text-muted">{formatPrice(dish.price)} · Most ordered</p>
      </div>
      <button
        type="button"
        aria-label={`Add ${dish.name}`}
        onClick={() => openDish(dish.id)}
        className="ml-2 grid size-10 place-items-center rounded-full bg-cocoa text-paper transition hover:bg-jollof"
      >
        <Plus className="size-5" strokeWidth={3} />
      </button>
    </div>
  )
}

export const Hero = () => {
  const { isOpen } = useOpeningStatus()

  return (
    <section>
      <Container className="grid gap-6 pt-3 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:pt-4">
        <div className="self-center lg:pb-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-ewedu/10 px-3.5 py-1.5 text-[13px] font-semibold text-ewedu">
            <span
              aria-hidden
              className={cn('size-2 rounded-full', isOpen ? 'bg-ewedu' : 'bg-jollof')}
            />
            {isOpen ? 'Open now' : 'Closed now'}
            <span aria-hidden>·</span>
            <span className="md:hidden">NE postcodes</span>
            <span className="hidden md:inline">Delivering across NE postcodes</span>
          </p>

          <h1 className="mt-4 text-[3.1rem] leading-[0.98] sm:text-7xl xl:text-[6.25rem]">
            Lagos flavour, Newcastle
            <span className="block font-accent font-semibold italic tracking-normal text-jollof">
              doorstep.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-cocoa/80">
            Jollof, suya, egusi and dodo, cooked from scratch every day by Ugo and delivered hot in
            35 to 45 minutes.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/menu"
              className={buttonStyles({ size: 'lg', className: 'w-full sm:w-auto' })}
            >
              Order now →
            </Link>
            <Link
              to="/menu"
              className={buttonStyles({
                variant: 'outline',
                size: 'lg',
                className: 'hidden sm:inline-flex',
              })}
            >
              See the menu
            </Link>
          </div>

          <dl className="mt-9 hidden divide-x divide-line sm:flex">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label} className="px-6 first:pl-0">
                <dt className="font-display text-xl font-extrabold">{value}</dt>
                <dd className="text-xs text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] self-end lg:max-w-[640px]">
          <img
            src="/images/site/hero-plate.jpg"
            alt="A spread of jollof rice, plantain, moi moi and stews"
            width={1148}
            height={1041}
            className="w-full"
            fetchPriority="high"
          />
          <HeroDishChip />
          <p className="absolute bottom-[8%] right-[2%] hidden -rotate-6 rounded-full bg-ewedu px-4 py-2 text-xs font-bold text-white lg:block">
            Spice level: Naija hot
          </p>
        </div>
      </Container>
    </section>
  )
}
