import Image from "next/image"
import { Sparkle } from "./Sparkle"

interface LogoFullProps {
  variant?: "dark" | "light"
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

// Logo dosyası 822x438 (oran ~1.877)
const LOGO_RATIO = 822 / 438

const sizes = {
  sm: { h: 30, text: "text-lg", sparkle: 24 },
  md: { h: 38, text: "text-2xl", sparkle: 32 },
  lg: { h: 52, text: "text-3xl", sparkle: 42 },
  xl: { h: 66, text: "text-4xl", sparkle: 54 },
}

export function LogoFull({ variant = "dark", className = "", size = "md" }: LogoFullProps) {
  const { h, text, sparkle } = sizes[size]

  // Koyu zeminlerde (footer) beyaz yazılı varyant — SVG mark + beyaz kelime işareti
  if (variant === "light") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Sparkle size={sparkle} className="text-[#32E1BE]" />
        <span
          className={`font-extrabold ${text} tracking-tight text-white`}
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          bulalım
        </span>
      </div>
    )
  }

  // Açık zeminlerde resmi logo görseli (birebir)
  return (
    <Image
      src="/logo.jpg"
      alt="bulalım"
      width={Math.round(h * LOGO_RATIO)}
      height={h}
      priority
      className={className}
      style={{ height: h, width: "auto" }}
    />
  )
}
