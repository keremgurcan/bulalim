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
  const w = Math.round(h * LOGO_RATIO)
  const common = {
    alt: "bulalım",
    width: w,
    height: h,
    priority: true,
    style: { height: h, width: "auto" as const },
  }

  // Koyu zeminlerde (footer) her zaman şeffaf zeminli + beyaz yazılı sürüm.
  if (variant === "light") {
    return <Image src="/logo-light.png" {...common} className={className} />
  }

  // Varsayılan: açık temada beyaz zeminli logo.jpg, koyu temada şeffaf logo-light.png.
  // logo.jpg JPG olduğu (şeffaflık yok) için dark zeminde beyaz kutu çıkıyordu.
  return (
    <>
      <Image src="/logo.jpg" {...common} className={`${className} dark:hidden`} />
      <Image src="/logo-light.png" {...common} className={`hidden dark:block ${className}`} />
    </>
  )
}
