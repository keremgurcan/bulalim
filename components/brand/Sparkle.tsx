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
      <path d="M50 1 C51 32, 68 49, 99 50 C68 51, 51 68, 50 99 C49 68, 32 51, 1 50 C32 49, 49 32, 50 1 Z" />
    </svg>
  )
}
