import type { BadgeType } from "@/lib/badges"

interface BadgeIconProps {
  badge: BadgeType
  size?: number
  className?: string
  /** When false, renders a desaturated/locked look */
  earned?: boolean
}

/**
 * Hand-drawn SVG badge medals matching the Bulalım rozet set shown in the
 * "Haftanın Kahramanları" and profile "Rozet Vitrini" sections:
 * Item Hunter, Detective, Helper.
 */
export function BadgeIcon({ badge, size = 64, className = "", earned = true }: BadgeIconProps) {
  const gradId = `bg-${badge}`
  const ribbonId = `rb-${badge}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={earned ? undefined : { filter: "grayscale(1)", opacity: 0.45 }}
      role="img"
      aria-label={badge}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5FEACB" />
          <stop offset="1" stopColor="#1FC4A2" />
        </linearGradient>
        <linearGradient id={ribbonId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F5547" />
          <stop offset="1" stopColor="#073A30" />
        </linearGradient>
      </defs>

      {/* Medallion base */}
      <circle cx="32" cy="30" r="22" fill={`url(#${gradId})`} stroke="#073A30" strokeWidth="2.5" />
      <circle cx="32" cy="30" r="16.5" fill="#F7F9F8" />

      {/* Ribbons */}
      <path d="M22 47 L18 60 L26 55 L29 50 Z" fill={`url(#${ribbonId})`} />
      <path d="M42 47 L46 60 L38 55 L35 50 Z" fill={`url(#${ribbonId})`} />

      {renderGlyph(badge)}
    </svg>
  )
}

function renderGlyph(badge: BadgeType) {
  const c = "#073A30"
  switch (badge) {
    case "item_hunter":
      // Magnifying glass over a target
      return (
        <g stroke={c} strokeWidth="2.4" strokeLinecap="round" fill="none">
          <circle cx="30" cy="28" r="7" />
          <circle cx="30" cy="28" r="2.6" fill={c} stroke="none" />
          <line x1="35" y1="33" x2="40" y2="38" />
        </g>
      )
    case "detective":
      // Detective hat + magnifier
      return (
        <g stroke={c} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M22 26 Q32 16 42 26 Z" fill={c} />
          <path d="M19 27 H45" />
          <circle cx="29" cy="36" r="4.2" fill="none" />
          <line x1="32" y1="39" x2="36" y2="43" fill="none" />
        </g>
      )
    case "helper":
      // Heart in open hand
      return (
        <g stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M32 24 c-2-3-7-3-8 1 c-1 3 2 6 8 10 c6-4 9-7 8-10 c-1-4-6-4-8-1 Z"
            fill={c}
            stroke="none"
          />
          <path d="M22 40 q10 6 20 0" fill="none" />
        </g>
      )
    default:
      return null
  }
}
