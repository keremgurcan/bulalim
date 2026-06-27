"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

interface ThemeToggleProps {
  className?: string
}

/**
 * Light/Dark geçiş butonu. <html>'deki "dark" sınıfını anında değiştirir (reload yok)
 * ve tercihi cookie'ye yazar; sonraki yüklemede sunucu doğru temayı render eder.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    document.cookie = `theme=${next ? "dark" : "light"}; path=/; max-age=31536000`
    setDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Açık temaya geç" : "Koyu temaya geç"}
      title={dark ? "Açık tema" : "Koyu tema"}
      className={
        className ??
        "p-2 rounded-lg text-[#073A30] hover:bg-[#F7F9F8] transition-colors"
      }
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
