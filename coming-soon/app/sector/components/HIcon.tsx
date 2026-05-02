/* Lightweight icon component — replaces @hugeicons (44MB) with inline SVG paths (~3KB) */
import { I, getIconPath } from '../../components/icons'

export default function HIcon({ name, size = 20, color = 'currentColor', sw = 1.5 }: {
  name: string; size?: number; color?: string; sw?: number
}) {
  return <I d={getIconPath(name)} size={size} color={color} sw={sw} />
}
