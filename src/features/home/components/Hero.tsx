import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { Stagger } from '@/components/motion/Stagger'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { HERO_STATS } from '@/constants/content'
import { EASE_OUT, fadeUp, HOVER_GROW, popIn, PRESS, SPRING, stagger } from '@/constants/motion'
import { useOpeningStatus } from '@/hooks/useOpeningStatus'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { useDishes } from '@/services/menu/menu.queries'
import { useSiteInfo } from '@/services/site/site.queries'
import { useUiStore } from '@/stores/ui.store'

const HERO_DISH_ID = 'party-jollof-rice'

const HeroDishChip = () => {
  const { data: dishes } = useDishes()
  const openDish = useUiStore((state) => state.openDish)
  const dish = dishes?.find(({ id }) => id === HERO_DISH_ID)

  if (!dish) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.9 }}
      className="absolute bottom-[8%] left-[-4%] hidden items-center gap-3 rounded-2xl bg-paper p-2.5 pr-3 shadow-float lg:flex"
    >
      <img src={dish.image} alt="" className="size-14 rounded-xl object-cover" />
      <div>
        <p className="font-display font-bold leading-tight">{dish.name}</p>
        <p className="text-xs text-muted">{formatPrice(dish.price)} · Most ordered</p>
      </div>
      <motion.button
        type="button"
        whileHover={HOVER_GROW}
        whileTap={PRESS}
        aria-label={`Add ${dish.name}`}
        onClick={() => openDish(dish.id)}
        className="ml-2 grid size-10 place-items-center rounded-full bg-cocoa text-paper transition-colors hover:bg-jollof"
      >
        <Plus className="size-5" strokeWidth={3} />
      </motion.button>
    </motion.div>
  )
}

/** The last word of the headline takes the accent style from the design. */
const splitHeadline = (headline: string) => {
  const words = headline.trim().split(' ')
  return { lead: words.slice(0, -1).join(' '), accent: words.at(-1) }
}

export const Hero = () => {
  const { isOpen } = useOpeningStatus()
  const { data: site } = useSiteInfo()
  const { lead, accent } = splitHeadline(site?.heroHeadline ?? '')

  return (
    <section>
      <Container className="grid gap-6 pt-3 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:pt-4">
        <Stagger trigger="mount" gap={0.1} className="self-center lg:pb-14">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-ewedu/10 px-3.5 py-1.5 text-[13px] font-semibold text-ewedu"
          >
            <span
              aria-hidden
              className={cn('size-2 rounded-full', isOpen ? 'bg-ewedu' : 'bg-jollof')}
            />
            {isOpen ? 'Open now' : 'Closed now'}
            <span aria-hidden>·</span>
            <span className="md:hidden">NE postcodes</span>
            <span className="hidden md:inline">Delivering across NE postcodes</span>
          </motion.p>

          <motion.h1
            variants={stagger(0.12)}
            className="mt-4 text-[3.1rem] leading-[0.98] sm:text-7xl xl:text-[6.25rem]"
          >
            <motion.span variants={fadeUp} className="block">
              {lead}
            </motion.span>
            <motion.span
              variants={popIn}
              className="block origin-left font-accent font-semibold italic tracking-normal text-jollof"
            >
              {accent}
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-[17px] leading-relaxed text-cocoa/80"
          >
            {site?.heroText}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row">
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
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-9 hidden divide-x divide-line sm:flex">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label} className="px-6 first:pl-0">
                <dt className="font-display text-xl font-extrabold">{value}</dt>
                <dd className="text-xs text-muted">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </Stagger>

        <div className="relative mx-auto w-full max-w-[420px] self-end lg:max-w-[640px]">
          <motion.img
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.2 }}
            src="/images/site/hero-plate.jpg"
            alt="A spread of jollof rice, plantain, moi moi and stews"
            width={1148}
            height={1041}
            className="w-full"
            fetchPriority="high"
          />
          <HeroDishChip />
          <motion.p
            initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -6, y: [0, -8, 0] }}
            transition={{
              default: { ...SPRING, delay: 1.1 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 },
            }}
            className="absolute bottom-[8%] right-[2%] hidden rounded-full bg-ewedu px-4 py-2 text-xs font-bold text-white lg:block"
          >
            Spice level: Naija hot
          </motion.p>
        </div>
      </Container>
    </section>
  )
}
