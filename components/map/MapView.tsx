"use client"

import { useEffect, useRef } from "react"
import type { Map as LeafletMap, LayerGroup } from "leaflet"
import type { Item } from "@/lib/types"
import { CATEGORY_ICONS } from "@/lib/types"

interface MapViewProps {
  items: Item[]
  center?: [number, number]
  zoom?: number
  selectedId?: string | null
  onMarkerClick?: (item: Item) => void
  height?: string
}

export function MapView({
  items,
  center = [41.0082, 28.9784],
  zoom = 12,
  selectedId = null,
  onMarkerClick,
  height = "100%",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<LeafletMap | null>(null)
  const markerLayer = useRef<LayerGroup | null>(null)
  const leafletRef = useRef<typeof import("leaflet") | null>(null)
  const onClickRef = useRef(onMarkerClick)
  onClickRef.current = onMarkerClick

  // Init map once
  useEffect(() => {
    let cancelled = false

    async function initMap() {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")
      if (cancelled || !mapRef.current || mapInstance.current) return

      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      })

      // Clean, Google-Maps-like basemap (CARTO Voyager).
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map)

      L.control.zoom({ position: "topright" }).addTo(map)
      L.control.attribution({ position: "bottomright", prefix: false })
        .addAttribution("© OpenStreetMap, © CARTO")
        .addTo(map)

      markerLayer.current = L.layerGroup().addTo(map)
      mapInstance.current = map
      leafletRef.current = L

      renderMarkers()
    }

    initMap()
    return () => {
      cancelled = true
      mapInstance.current?.remove()
      mapInstance.current = null
      markerLayer.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-render markers whenever items or selection change
  useEffect(() => {
    renderMarkers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedId])

  function renderMarkers() {
    const L = leafletRef.current
    const layer = markerLayer.current
    if (!L || !layer) return
    layer.clearLayers()

    items.forEach((item) => {
      const color = item.type === "lost" ? "#ef4444" : "#22c55e"
      const isSel = item.id === selectedId
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative; transform:${isSel ? "scale(1.2)" : "scale(1)"}; transition:transform .15s;">
            <div style="
              width:30px; height:30px; background:${color};
              border:3px solid white; border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              box-shadow:0 3px 10px rgba(0,0,0,${isSel ? 0.45 : 0.3});
              display:flex; align-items:center; justify-content:center;">
              <span style="transform:rotate(45deg); font-size:12px; line-height:1;">${CATEGORY_ICONS[item.category] ?? ""}</span>
            </div>
          </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      })

      const marker = L.marker([item.lat, item.lng], { icon, zIndexOffset: isSel ? 1000 : 0 })
      const photo = item.photo_urls?.[0]
      marker.bindPopup(
        `<div style="min-width:180px; font-family:var(--font-manrope, sans-serif);">
          ${photo ? `<img src="${photo}" style="width:100%; height:80px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />` : ""}
          <div style="font-size:11px; font-weight:700; color:${color}; margin-bottom:2px;">
            ${item.type === "lost" ? "Kayıp" : "Bulundu"}
          </div>
          <div style="font-size:13px; font-weight:600; color:#073A30; margin-bottom:4px; line-height:1.3;">${item.title}</div>
          <div style="font-size:11px; color:#6B7773; margin-bottom:8px;">📍 ${item.location_text || item.city}</div>
          <a href="/items/${item.id}" style="display:block; background:#073A30; color:white; text-align:center; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600; text-decoration:none;">Detayı Gör</a>
        </div>`,
        { maxWidth: 220 }
      )
      marker.on("click", () => onClickRef.current?.(item))
      marker.addTo(layer)

      if (isSel) {
        mapInstance.current?.panTo([item.lat, item.lng], { animate: true })
        marker.openPopup()
      }
    })
  }

  return <div ref={mapRef} style={{ width: "100%", height }} />
}
