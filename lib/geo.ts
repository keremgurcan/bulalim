const EARTH_RADIUS_KM = 6371

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=tr`,
      { headers: { "User-Agent": "bulalim-app/1.0" } }
    )
    const data = await res.json()
    const addr = data.address
    const parts = [
      addr.neighbourhood || addr.suburb || addr.quarter,
      addr.district || addr.county || addr.city_district,
      addr.city || addr.town || addr.village,
    ].filter(Boolean)
    return parts.slice(0, 2).join(", ") || data.display_name?.split(",")[0] || ""
  } catch {
    return ""
  }
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}
