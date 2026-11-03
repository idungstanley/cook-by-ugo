import { Link } from '@tanstack/react-router'
import { LogoMark } from './LogoMark'

export const Logo = ({ className }: { className?: string }) => (
  <Link to="/" aria-label="Cooked by Ugo home" className="inline-flex shrink-0">
    <LogoMark className={className} />
  </Link>
)
