"use client"

import { useEffect, useRef, useState } from "react"
import { reverseGeocode } from "@/lib/geo"
import { MapPin } from "lucide-react"

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number, address: string) => void
  initialLat?: number
  initialLng?: number
}

export function LocationPicker({ onLocationChange, initialLat = 41.0082, initialLng = 28.9784 }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return

    let L: typeof import("leaflet")
    let map: import("leaflet").Map
    let marker: import("leaflet").Marker

    async function init() {
      L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")
      if (!mapRef.current) return

      map = L.map(mapRef.current, { center: [initialLat, initialLng], zoom: 13 })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        className: "",
        html: `<div style="color:#073A30; font-size:32px; line-height:1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      marker = L.marker([initialLat, initialLng], { draggable: true, icon }).addTo(map)

      async function updateLocation(lat: number, lng: number) {
        setLoading(true)
        const addr = await reverseGeocode(lat, lng)
        setAddress(addr)
        setLoading(false)
        onLocationChange(lat, lng, addr)
      }

      marker.on("dragend", () => {
        const pos = marker.getLatLng()
        updateLocation(pos.lat, pos.lng)
      })

      map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
        marker.setLatLng(e.latlng)
        updateLocation(e.latlng.lat, e.latlng.lng)
      })

      updateLocation(initialLat, initialLng)
    }

    init()
    return () => { map?.remove() }
  }, [])

  function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      setLoading(true)
      const addr = await reverseGeocode(lat, lng)
      setAddress(addr)
      setLoading(false)
      onLocationChange(lat, lng, addr)
    })
  }

  return (
    <div className="space-y-2">
      <div className="rounded-xl overflow-hidden border border-[#E8EDEB] h-64">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-[#F7F9F8] rounded-lg px-3 py-2 text-sm text-[#6B7773]">
          <MapPin className="w-4 h-4 text-[#32E1BE] shrink-0" />
          <span className="truncate">{loading ? "Adres alınıyor..." : address || "Haritaya tıkla veya pin sürükle"}</span>
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          className="text-xs text-[#073A30] font-semibold hover:text-[#32E1BE] transition-colors whitespace-nowrap"
        >
          📍 Konumumu Bul
        </button>
      </div>
    </div>
  )
}
