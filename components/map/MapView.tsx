"use client"

import { useEffect, useRef } from "react"
import type { Item } from "@/lib/types"

interface MapViewProps {
  items: Item[]
  center?: [number, number]
  onMarkerClick?: (item: Item) => void
  height?: string
}

export function MapView({ items, center = [41.0082, 28.9784], onMarkerClick, height = "100%" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    let L: typeof import("leaflet")
    let map: import("leaflet").Map

    async function initMap() {
      L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      if (!mapRef.current) return

      map = L.map(mapRef.current, {
        center,
        zoom: 12,
        zoomControl: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      mapInstance.current = map

      items.forEach((item) => {
        const color = item.type === "lost" ? "#ef4444" : "#22c55e"
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width: 32px; height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        })

        const marker = L.marker([item.lat, item.lng], { icon }).addTo(map)

        const photo = item.photo_urls?.[0]
        marker.bindPopup(`
          <div style="min-width: 180px; font-family: var(--font-manrope, sans-serif);">
            ${photo ? `<img src="${photo}" style="width:100%; height:80px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />` : ""}
            <div style="font-size:11px; font-weight:700; color:${color}; margin-bottom:2px;">
              ${item.type === "lost" ? "Kayıp" : "Bulundu"}
            </div>
            <div style="font-size:13px; font-weight:600; color:#073A30; margin-bottom:4px; line-height:1.3;">
              ${item.title}
            </div>
            <div style="font-size:11px; color:#6B7773; margin-bottom:8px;">📍 ${item.location_text || item.city}</div>
            <a href="/items/${item.id}"
              style="display:block; background:#073A30; color:white; text-align:center;
              padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600;
              text-decoration:none;"
            >Detayı Gör</a>
          </div>
        `, { maxWidth: 220 })

        if (onMarkerClick) {
          marker.on("click", () => onMarkerClick(item))
        }
      })
    }

    initMap()

    return () => {
      if (map) {
        map.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return <div ref={mapRef} style={{ width: "100%", height }} />
}
