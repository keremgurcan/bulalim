interface SparkleProps {
  className?: string
  size?: number
}

export function Sparkle({ className = "", size = 24 }: SparkleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M50 0 C54 36, 63 46, 92 50 C63 54, 54 63, 50 100 C46 63, 37 54, 8 50 C37 46, 46 36, 50 0 Z" />
    </svg>
  )
}
