import {
  MoonIcon,
  PaletteIcon,
  SearchIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

// Icons are imported one by one, so the page only gets the ones you use.
// Full list: https://lucide.dev/icons
const icons: Record<string, LucideIcon> = {
  zap: ZapIcon,
  smartphone: SmartphoneIcon,
  palette: PaletteIcon,
  search: SearchIcon,
  moon: MoonIcon,
  "shield-check": ShieldCheckIcon,
}

export function FeatureIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = icons[name] ?? ZapIcon
  return <Icon className={className} />
}
