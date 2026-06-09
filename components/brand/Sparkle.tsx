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
      <path d="M50 0 C53 33, 67 47, 100 50 C67 53, 53 67, 50 100 C47 67, 33 53, 0 50 C33 47, 47 33, 50 0 Z" />
    </svg>
  )
}
