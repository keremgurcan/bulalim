interface EDevletLogoProps {
  className?: string
}

// Resmî e-Devlet Kapısı logosunun (kırmızı kare + beyaz yörünge swoosh + yıldız)
// SVG yeniden çizimi. Görsel dosyaya gerek kalmadan her yerde net görünür.
export function EDevletLogo({ className }: EDevletLogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label="e-Devlet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="112" fill="#E30A17" />
      {/* Yörünge swoosh — eğik, üst-sağ tarafı açık beyaz elips */}
      <ellipse
        cx="256"
        cy="256"
        rx="176"
        ry="116"
        fill="none"
        stroke="#ffffff"
        strokeWidth="46"
        strokeLinecap="round"
        transform="rotate(-22 256 256)"
        strokeDasharray="690 280"
        strokeDashoffset="150"
      />
      {/* Beş köşeli yıldız (açıklığın olduğu üst-sağ köşede) */}
      <g transform="translate(296 96) scale(4.2)">
        <path
          d="M12 2l2.9 6.26 6.88.99-4.98 4.85 1.18 6.88L12 17.77l-6.16 3.24 1.18-6.88L2.07 9.25l6.88-.99L12 2z"
          fill="#ffffff"
        />
      </g>
    </svg>
  )
}
