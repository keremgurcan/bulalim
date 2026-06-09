import { Smartphone, Wallet, KeyRound, Headphones, FileText, Briefcase } from "lucide-react"

/**
 * Decorative hero backdrop: a stylized city skyline with floating "lost item"
 * pins connected to a network — evoking the screenshot's dayanışma ağı art.
 */
export function HeroBackdrop() {
  const floats = [
    { Icon: Smartphone, className: "left-[6%] top-[22%]", delay: "0s" },
    { Icon: Wallet, className: "left-[16%] top-[55%]", delay: "0.6s" },
    { Icon: KeyRound, className: "left-[2%] top-[74%]", delay: "1.2s" },
    { Icon: Headphones, className: "right-[8%] top-[28%]", delay: "0.3s" },
    { Icon: FileText, className: "right-[18%] top-[60%]", delay: "0.9s" },
    { Icon: Briefcase, className: "right-[4%] top-[78%]", delay: "1.5s" },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Skyline silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full text-[#0F5547]/40"
        viewBox="0 0 1440 220"
        fill="currentColor"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 220 V120 h60 v-30 h40 v40 h50 V70 h60 v80 h40 V100 h70 v60 h50 V60 h50 v100 h60 V110 h40 v50 h60 V80 h60 v80 h50 V120 h50 v40 h60 V90 h50 v70 h60 V60 h50 v100 h60 V110 h40 v50 h70 V70 h50 v90 h60 V120 h60 v40 h50 V100 h40 v60 h60 V220 Z" />
      </svg>

      {/* Floating item chips */}
      {floats.map(({ Icon, className, delay }, i) => (
        <div
          key={i}
          className={`absolute ${className} hidden animate-pulse rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-sm md:block`}
          style={{ animationDelay: delay, animationDuration: "3s" }}
        >
          <Icon className="h-6 w-6 text-[#5FEACB]" />
        </div>
      ))}
    </div>
  )
}
