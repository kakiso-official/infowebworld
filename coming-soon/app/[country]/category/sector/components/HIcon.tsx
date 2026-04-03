'use client'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon, Search02Icon, SearchVisualIcon, GlobalSearchIcon, StarIcon, RocketIcon, Rocket01Icon, Home01Icon,
  Shield01Icon, CodeIcon, EyeIcon, UserGroupIcon, BarChartIcon,
  GlobeIcon, Globe02Icon, CloudIcon, FlashIcon, GridIcon,
  LayerIcon, FilterIcon, Building01Icon, Building02Icon, Message01Icon,
  MapPinIcon, Tick01Icon, PlusSignIcon, ArrowRight01Icon,
  Briefcase01Icon, PieChart01Icon, FireIcon, Award01Icon,
  Clock01Icon, CpuIcon, ChartIncreaseIcon, AnalyticsUpIcon,
  SparklesIcon, FavouriteIcon, CheckmarkBadge01Icon, Compass01Icon,
  ChartColumnIcon, SlidersHorizontalIcon, Cancel01Icon,
  ArrowLeft01Icon, SquareArrowUpRightIcon,
} from '@hugeicons/core-free-icons'

const ICON_MAP: Record<string, typeof StarIcon> = {
  search: Search01Icon, search02: Search02Icon, searchVisual: SearchVisualIcon, globalSearch: GlobalSearchIcon, star: StarIcon, rocket: RocketIcon, rocket01: Rocket01Icon,
  home: Home01Icon, shield: Shield01Icon, code: CodeIcon, eye: EyeIcon,
  users: UserGroupIcon, barChart: BarChartIcon, chartColumn: ChartColumnIcon,
  globe: GlobeIcon, globe02: Globe02Icon, cloud: CloudIcon, zap: FlashIcon,
  flash: FlashIcon, grid: GridIcon, layers: LayerIcon, filter: FilterIcon,
  building: Building01Icon, building02: Building02Icon, messageCircle: Message01Icon,
  message: Message01Icon, mapPin: MapPinIcon, check: Tick01Icon, plus: PlusSignIcon,
  arrow: ArrowRight01Icon, arrowLeft: ArrowLeft01Icon, briefcase: Briefcase01Icon,
  pieChart: PieChart01Icon, fire: FireIcon, award: Award01Icon, clock: Clock01Icon,
  cpu: CpuIcon, trendingUp: ChartIncreaseIcon, analyticsUp: AnalyticsUpIcon,
  sparkles: SparklesIcon, favourite: FavouriteIcon, verified: CheckmarkBadge01Icon,
  compass: Compass01Icon, sliders: SlidersHorizontalIcon, cancel: Cancel01Icon,
  externalLink: SquareArrowUpRightIcon, monitor: ChartColumnIcon,
}

export default function HIcon({ name, size = 20, color = 'currentColor', sw = 1.5 }: {
  name: string; size?: number; color?: string; sw?: number
}) {
  const icon = ICON_MAP[name] || GridIcon
  return <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={sw} />
}

export { ICON_MAP }
