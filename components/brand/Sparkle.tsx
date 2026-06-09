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
      <path d="M50 3 C56 30, 70 44, 97 50 C70 56, 56 70, 50 97 C44 70, 30 56, 3 50 C30 44, 44 30, 50 3 Z" />
    </svg>
  )
}
