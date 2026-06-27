import "server-only"
import { cookies } from "next/headers"

export type Theme = "light" | "dark"

/** Tema cookie'sini okur (varsayılan light). SSR'da <html>'e dark sınıfı vermek için. */
export async function getServerTheme(): Promise<Theme> {
  const cookieStore = await cookies()
  return cookieStore.get("theme")?.value === "dark" ? "dark" : "light"
}
