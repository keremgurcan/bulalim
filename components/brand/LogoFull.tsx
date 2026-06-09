import { Sparkle } from "./Sparkle"

interface LogoFullProps {
  variant?: "dark" | "light"
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: { sparkle: 24, text: "text-lg" },
  md: { sparkle: 32, text: "text-2xl" },
  lg: { sparkle: 42, text: "text-3xl" },
}

export function LogoFull({ variant = "dark", className = "", size = "md" }: LogoFullProps) {
  const wordmarkColor = variant === "light" ? "#FFFFFF" : "#073A30"
  const { sparkle, text } = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sparkle size={sparkle} className="text-[#32E1BE]" />
      <span
        className={`font-extrabold ${text} tracking-tight`}
        style={{ color: wordmarkColor, fontFamily: "var(--font-manrope)" }}
      >
        bulalım
      </span>
    </div>
  )
}
