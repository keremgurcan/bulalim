"use client"

import { useEffect } from "react"
import { incrementItemView } from "./actions"

/**
 * Ilan goruntulendiginde sayaci bir kez artirir. Ayni tarayicida ayni ilan
 * tekrar acilirsa (refresh dahil) tekrar saymaz; boylece "kac kisi gordu"
 * tekil ziyaretciye yakin olur. Sahibin ziyareti server tarafinda elenir.
 */
export function ViewTracker({ itemId }: { itemId: string }) {
  useEffect(() => {
    const key = "bulalim_viewed"
    try {
      const seen: string[] = JSON.parse(localStorage.getItem(key) || "[]")
      if (seen.includes(itemId)) return
      localStorage.setItem(key, JSON.stringify([...seen, itemId]))
    } catch {
      // localStorage yoksa yine de say
    }
    void incrementItemView(itemId)
  }, [itemId])

  return null
}
