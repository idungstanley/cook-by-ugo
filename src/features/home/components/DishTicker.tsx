import { AsoOkeBand } from '@/components/brand/AsoOkeBand'
import { TICKER_ITEMS } from '@/constants/content'

const TickerRow = ({ hidden }: { hidden?: boolean }) => (
  <ul aria-hidden={hidden} className="flex shrink-0 items-center">
    {TICKER_ITEMS.map((item) => (
      <li key={item} className="flex items-center whitespace-nowrap">
        <span className="px-8 font-display text-xl font-bold md:text-2xl">{item}</span>
        <span aria-hidden className="text-gold">
          ✷
        </span>
      </li>
    ))}
  </ul>
)

export const DishTicker = () => (
  <div className="overflow-hidden bg-cocoa text-paper">
    <AsoOkeBand />
    <div className="flex w-max animate-ticker py-5 hover:[animation-play-state:paused]">
      <TickerRow />
      <TickerRow hidden />
      <TickerRow hidden />
      <TickerRow hidden />
    </div>
  </div>
)
