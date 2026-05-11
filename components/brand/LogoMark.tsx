import { Sparkle } from "./Sparkle"

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 32, className = "" }: LogoMarkProps) {
  return <Sparkle size={size} className={`text-[#32E1BE] ${className}`} />
}
