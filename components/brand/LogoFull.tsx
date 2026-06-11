import Image from "next/image"

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
  const { h } = sizes[size]

  // Koyu zeminlerde (footer) gerçek logonun beyaz yazılı + şeffaf zeminli sürümü
  const src = variant === "light" ? "/logo-light.png" : "/logo.jpg"

  return (
    <Image
      src={src}
      alt="bulalım"
      width={Math.round(h * LOGO_RATIO)}
      height={h}
      priority
      className={className}
      style={{ height: h, width: "auto" }}
    />
  )
}
