"use client"

import { useEffect, useRef, useState } from "react"
import { SearchSwitch } from "./SearchSwitch"
import type { Locale } from "@/lib/i18n"

/**
 * Hero arama kartı + beyaz zemin, banner görseliyle BİREBİR aynı oranda ölçeklenir.
 * Banner genişlikle ölçeklendiğinden (yükseklik = genişlik / en-boy), kartı da
 * banner'ın doğal genişliğine göre transform:scale ile ölçekliyoruz. Böylece her
 * zoom/ekran genişliğinde kart, gömülü placeholder ve beyaz panel hep hizalı kalır
 * (bir kısım sabit bir kısım oynar sorunu biter).
 */

const BANNER_NATURAL_WIDTH = 2526 // hero-banner-v3.png doğal genişliği
const CARD_DESIGN_WIDTH = 1086 // banner'a gömülü kartın genişliği (~%43)
const PANEL_DESIGN_HEIGHT = 380 // gömülü placeholder'ı tam örtecek beyaz zemin yüksekliği

interface HeroSearchCardProps {
  lang: Locale
}

export function HeroSearchCard({ lang }: HeroSearchCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const section = ref.current?.parentElement
    if (!section) return
    const update = () => setScale(section.clientWidth / BANNER_NATURAL_WIDTH)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(section)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="absolute z-10"
      style={{
        left: "29.75%",
        top: "42.5%",
        width: CARD_DESIGN_WIDTH,
        transformOrigin: "top left",
        transform: `scale(${scale})`,
        visibility: scale ? "visible" : "hidden",
      }}
    >
      <div className="relative">
        {/* Gömülü bej placeholder'ı örten beyaz zemin (kartla birlikte ölçeklenir). */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 w-full rounded-t-3xl bg-white shadow-2xl"
          style={{ height: PANEL_DESIGN_HEIGHT }}
        />
        <div className="relative">
          <SearchSwitch lang={lang} flush />
        </div>
      </div>
    </div>
  )
}
